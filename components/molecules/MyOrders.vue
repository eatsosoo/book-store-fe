<template>
  <div class="MyOrders">
    <!-- <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title color="primary"
          >Tìm kiếm đơn hàng</v-expansion-panel-title
        >
        <v-expansion-panel-text> -->
          <SearchFormOrder
            :loading="pageState.loading"
            @orderCode="searchForm.orderCode = $event"
            @bookName="searchForm.book_name = $event"
            @customerName="searchForm.customerName = $event"
            @customerPhone="searchForm.customerPhone = $event"
            @status="searchForm.status = $event"
            @dateRange="searchForm.dateRange = $event"
            @reset="resetSearchForm"
            @search="loadItems({ page: pageState.page, itemsPerPage: pageState.itemsPerPage, sortBy: pageState.sort })"
          ></SearchFormOrder>
        <!-- </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels> -->

    <v-card class="mt-10">
      <v-data-table-server
        v-model:items-per-page="pageState.itemsPerPage"
        :headers="DEFAULT_HEADERS"
        :items="pageState.items"
        :items-length="pageState.totalItems"
        :loading="pageState.loading"
        :page-text="pageText"
        items-per-page-text="Đơn hàng mỗi trang"
        no-data-text="Không có đơn hàng nào"
        item-value="name"
        class="DataTableHeight"
        @update:options="loadItems"
        @update:page="pageState.page = $event"
      >
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
          <v-chip :class="item.status">{{ convertStatus(item.status) }}</v-chip>
        </template>
        <template #item.actions="{ item }">
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
        </template>
      </v-data-table-server>
    </v-card>

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
import { useApi, type ResponseResultType } from "@/composable/useApiFetch";
import OrderDialog from "~/components/organisms/OrderDialog.vue";
import { useAuthStore } from "~/store/authStore";
import SearchFormOrder from "./SearchFormOrder.vue";

export type OrderItem = {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
};

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
  { title: "Ngày đặt hàng", key: "created_at", align: "center" },
  { title: "", key: "actions", align: "center", sortable: false },
];
const DEFAULT_SORT = [{ key: "id", order: "desc" }];

const authStore = useAuthStore();

const pageState = reactive({
  page: 1,
  itemsPerPage: 10,
  totalPages: 1,
  loading: true,
  totalItems: 0,
  items: [] as OrderItem[],
  targetId: "",
  targetStatus: "",
  editId: "",
  sort: DEFAULT_SORT,
});
const editDialog = ref(false);
const statusDialog = ref(false);
const searchForm = reactive({
  orderCode: "",
  book_name: "",
  customerName: "",
  customerPhone: "",
  status: "",
  dateRange: []
});

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

const loadItems = async ({ page, itemsPerPage, sortBy }: { page: number, itemsPerPage: number; sortBy: any[]}) => {
  pageState.loading = true;

  const { api } = useApi(undefined, "GET", null, undefined);
  let paging = "";
  let sorting = "";

  if (page && itemsPerPage) {
    paging = "pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
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
  &status=${searchForm.status}&${created_at}
  &book_name=${searchForm.book_name}`;

  const { data: responseData } = await api<ResponseResultType>(
    `/orders?user_id=${authStore.profile.id}&` + paging + sorting + "&" + params
  );

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { orders, pagination } = responseData.value.data;
    pageState.items = orders;
    pageState.totalItems = pagination.total;
    pageState.totalPages = pagination.total_pages;
  }

  pageState.loading = false;
};

const updateStatusOrder = async (id: string) => {
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
  searchForm.book_name = "";
  searchForm.customerName = "";
  searchForm.customerPhone = "";
  searchForm.status = "";
  searchForm.dateRange = [];

  loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
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
