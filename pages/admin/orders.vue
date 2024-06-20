<template>
  <div class="AdminOrders">
    <h1 class="text-capitalize">đơn hàng</h1>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-data-table-server
        v-model:items-per-page="pageState.itemsPerPage"
        :headers="DEFAULT_HEADERS"
        :items="pageState.items"
        :items-length="pageState.totalItems"
        :loading="pageState.loading"
        items-per-page-text="Đơn hàng mỗi trang"
        no-data-text="Không có đơn hàng nào"
        item-value="name"
        class="DataTableHeight"
        @update:options="loadItems"
      >
        <template #item.id="{ item }">
          <span
            class="text-light-blue cursor-pointer text-decoration-underline"
            @click="(editDialog = true), (pageState.editId = `${item.id}`)"
            >{{ item.id }}</span
          >
        </template>
        <template #item.total_amount="{ item }">{{
          formatCurrency(
            Number(item.total_amount) + Number(item.shipping_cost)
          ) + " đ"
        }}</template>
        <template #item.status="{ item }">
          <v-chip :class="item.status">{{ convertStatus(item.status) }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            v-if="item.status === 'pending'"
            class="mr-2"
            color="blue"
            icon="mdi-moped"
            density="compact"
            @click="
              (statusDialog = true),
                (pageState.targetId = `${item.id}`),
                (pageState.targetStatus = 'processing')
            "
          >
          </v-btn>
          <v-btn
            v-if="item.status === 'pending'"
            class="mr-2"
            color="red"
            icon="mdi-close-thick"
            density="compact"
            @click="
              (statusDialog = true),
                (pageState.targetId = `${item.id}`),
                (pageState.targetStatus = 'cancelled')
            "
          ></v-btn>
          <v-btn
            v-if="item.status === 'processing'"
            class="mr-2"
            color="green"
            icon="mdi-check-bold"
            density="compact"
            @click="
              (statusDialog = true),
                (pageState.targetId = `${item.id}`),
                (pageState.targetStatus = 'completed')
            "
          ></v-btn>
        </template>
      </v-data-table-server>
    </div>

    <Confirm
      :active="statusDialog"
      :text="questionCancel"
      @rejected="statusDialog = false"
      @accepted="updateStatusOrder(pageState.targetId)"
    ></Confirm>

    <OrderDialog
      :orderId="pageState.editId"
      :active="editDialog"
      @close="editDialog = false"
      @submit="
        (editDialog = false),
          loadItems({ page: 1, itemsPerPage: 10, sortBy: pageState.sort })
      "
    ></OrderDialog>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useApi } from "@/composable/useApiFetch";
import OrderDialog from "~/components/organisms/OrderDialog.vue";

definePageMeta({
  layout: "admin",
});

const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Mã đơn hàng", key: "order_code", align: "start" },
  { title: "Tên khách hàng", key: "user_name", align: "start" },
  { title: "Số điện thoại", key: "user_phone", align: "start" },
  { title: "Tổng đơn hàng (VNĐ)", key: "total_amount", align: "center" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Ngày tạo", key: "created_at", align: "center" },
  {
    title: "Cập nhật trạng thái",
    key: "actions",
    align: "center",
    sortable: false,
  },
];
const DEFAULT_SORT = [{ key: "id", order: "desc" }];
const pageState = reactive({
  itemsPerPage: 10,
  loading: true,
  totalItems: 0,
  items: [],
  targetId: "",
  targetStatus: "",
  editId: "",
  sort: DEFAULT_SORT,
});
const editDialog = ref(false);
const statusDialog = ref(false);

const orderCode = computed(() => {
  return pageState.items.find(
    (item) => item.id.toString() === pageState.targetId
  )?.order_code;
});

const questionCancel = computed(() => {
  switch (pageState.targetStatus) {
    case "cancelled":
      return `Xác nhận huỷ đơn hàng có Mã số: ${orderCode.value} ?`;
    case "completed":
      return `Xác nhận hoàn thành đơn hàng có Mã số: ${orderCode.value} ?`;
    case "processing":
      return `Xác nhận tiến hành giao đơn hàng có Mã số: ${orderCode.value} ?`;
    default:
      return "";
  }
});

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  pageState.loading = true;
  pageState.sort = sortBy;

  const { api } = useApi(undefined, "GET", null, undefined);
  let paging = "";
  let sorting = "";

  if (page && itemsPerPage) {
    paging = "pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
  }

  if (sortBy && sortBy.length) {
    sorting += "&sort=" + JSON.stringify(sortBy[0]);
  }

  const { data: responseData } = await api("/orders?" + paging + sorting);

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { orders, pagination } = responseData.value.data;
    pageState.items = orders;
    pageState.totalItems = pagination.total;
  }

  pageState.loading = false;
};

const updateStatusOrder = async (id) => {
  if (!id) return;

  const { api } = useApi(undefined, "POST", null, {
    id,
    status: pageState.targetStatus,
  });
  const { errors } = await api(`/orders/${id}/status`);

  if (!errors) {
    loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
    switch (pageState.targetStatus) {
      case "cancelled":
        toastSuccess(`Huỷ đơn hàng ${orderCode.value} thành công`);
        break;
      case "completed":
        toastSuccess(`Hoàn thành đơn hàng ${orderCode.value}`);
        break;
      case "processing":
        toastSuccess(`Tiến hành giao đơn hàng ${orderCode.value}`);
        break;
      default:
        break;
    }
  }

  statusDialog.value = false;
};
</script>

<style scoped>
.DataTableHeight {
  max-height: 650px;
}
.pending {
  color: #ff9800;
}
.processing {
  color: #2196f3;
}
.completed {
  color: #4caf50;
}
.cancelled {
  color: #f44336;
}
</style>
