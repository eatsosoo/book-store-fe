<template>
  <div class="AdminOrders">
    <h1 class="text-capitalize">đơn hàng</h1>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <SearchFormOrder
        :loading="pageState.loading"
        @orderCode="searchForm.orderCode = $event"
        @bookName="searchForm.book_name = $event"
        @customerName="searchForm.customerName = $event"
        @customerPhone="searchForm.customerPhone = $event"
        @status="searchForm.status = $event"
        @dateRange="searchForm.dateRange = $event"
        @reset="resetSearchForm"
        @search="
          loadItems({
            page: pageState.page,
            itemsPerPage: pageState.itemsPerPage,
            sortBy: pageState.sort,
          })
        "
      ></SearchFormOrder>
    </div>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-card class="mx-auto">
        <v-data-table-server
          v-model:items-per-page="pageState.itemsPerPage"
          :headers="DEFAULT_HEADERS"
          :items="pageState.items"
          :items-length="pageState.totalItems"
          :loading="pageState.loading"
          items-per-page-text="Đơn hàng mỗi trang"
          no-data-text="Không có đơn hàng nào"
          item-value="name"
          :fixed-header="true"
          :items-per-page-options="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'Tất cả' },
          ]"
          :page-text="pageText"
          class="DataTableHeight"
          @update:options="loadItems"
          @update:page="pageState.page = $event"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>
          <template #item.order_code="{ item }">
            <span
              class="text-light-blue cursor-pointer text-decoration-underline"
              @click="(editDialog = true), (pageState.editId = `${item.id}`)"
              >{{ item.order_code }}</span
            >
          </template>
          <template #item.total_amount="{ item }">{{
            formatCurrency(
              Number(item.total_amount) + Number(item.shipping_cost)
            ) + " đ"
          }}</template>
          <template #item.status="{ item }">
            <v-chip :class="item.status">{{
              convertStatus(item.status)
            }}</v-chip>
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
      </v-card>
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
    ></OrderDialog>
  </div>
</template>

<script setup lang="ts">
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
  { title: "Tên người nhận", key: "customer_name", align: "start" },
  { title: "Số điện thoại", key: "customer_phone", align: "start" },
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
  page: 1,
  totalPages: 0,
  loading: true,
  totalItems: 0,
  items: [],
  targetId: "",
  targetStatus: "",
  editId: "",
  sort: DEFAULT_SORT,
});
const searchForm = reactive({
  orderCode: "",
  book_name: "",
  customerName: "",
  customerPhone: "",
  status: "",
  dateRange: null,
});
const editDialog = ref(false);
const statusDialog = ref(false);

const orderCode = computed(() => {
  return pageState.items.find(
    (item) => item.id.toString() === pageState.targetId
  )?.order_code;
});

const pageText = computed(() => {
  return `${pageState.page} / ${pageState.totalPages}`;
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
    paging = "&pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
  }

  if (sortBy && sortBy.length) {
    sorting += "&sort=" + JSON.stringify(sortBy[0]);
  } else {
    sorting += "&sort=" + JSON.stringify(DEFAULT_SORT[0]);
  }

  let created_at = "from=&to=";
  if (searchForm.dateRange) {
    created_at = convertDateRange(searchForm.dateRange);
  }

  const params = `order_code=${searchForm.orderCode}
  &customer_name=${searchForm.customerName}
  &customer_phone=${searchForm.customerPhone}
  &status=${searchForm.status}
  &book_name=${searchForm.book_name}
  &${created_at}`;

  const { data: responseData } = await api(
    `/orders?${params}` + paging + sorting
  );

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { orders, pagination } = responseData.value.data;
    pageState.items = orders
    pageState.totalItems = pagination.total;
    pageState.totalPages = pagination.total_pages;
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

const resetSearchForm = () => {
  searchForm.orderCode = "";
  searchForm.customerName = "";
  searchForm.customerPhone = "";

  loadItems({
    page: 1,
    itemsPerPage: 10,
    sortBy: DEFAULT_SORT,
  });
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

.MarginFieldSearch {
  /* padding-left: 200px; */
}
</style>
