<template>
  <div>
    <h1>Tổng quát</h1>
    <!-- Add your admin page content here -->
    <v-card class="pa-2 mt-5">
      <v-row>
        <v-col cols="3">
          <v-card class="pa-4 Bg1" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-finance</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Doanh thu tuần này</h3>
                <br />
                <br />
                <h2>{{ formatCurrency(commonData.revenue_this_week) }} đ</h2>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="pa-4 Bg2" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-hand-coin</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Số lượng đơn hàng tuần này</h3>
                <br />
                <h2>{{ commonData.orders_this_week }}</h2>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="pa-4 Bg3" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-chart-arc</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Doanh thu hôm nay</h3>
                <br />
                <br />
                <h2>{{ formatCurrency(commonData.revenue_today) }} đ</h2>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="pa-4 Bg4" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-file-chart-outline</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Số lượng đơn hàng hôm nay</h3>
                <br />
                <h2>{{ commonData.orders_today }}</h2>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="pa-4 mt-5">
      <v-row>
        <v-col></v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <BarChart :chartData="testData" :chart-options="options" />
        </v-col>
        <v-col cols="4">
          <DoughnutChart :chartData="testData" />
        </v-col>
      </v-row>
    </v-card>

    <v-card class="pa-5 mt-5">
      <v-data-table-server
          v-model:items-per-page="pageState.itemsPerPage"
          :headers="DEFAULT_HEADERS"
          :items="pageState.items"
          :items-length="pageState.totalItems"
          :loading="pageState.loading"
          items-per-page-text="Sản phẩm mỗi trang"
          no-data-text="Không có sản phẩm nào"
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
          <template #item.price="{ item }"
            >{{ formatCurrency(item.price) }} đ</template
          >
        </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "@/composable/useApiFetch";
import { DoughnutChart, BarChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

definePageMeta({
  layout: "admin",
});

type RevenueItem = {
  month: string;
  total: number;
};

const commonData = ref({
  revenue_this_week: 0,
  orders_this_week: 1,
  revenue_today: 0,
  orders_today: 0,
});
const testData = reactive({
  labels: [],
  datasets: [
    {
      label: "Doanh thu theo tháng (2024)",
      data: [],
      backgroundColor: [
        "#FF6633",
        "#FFB399",
        "#FF33FF",
        "#FFFF99",
        "#00B3E6",
        "#E6B333",
        "#3366E6",
        "#999966",
        "#99FF99",
        "#B34D4D",
        "#80B300",
        "#809900",
        "#E6B3B3",
        "#6680B3",
        "#66991A",
        "#FF99E6",
        "#CCFF1A",
        "#FF1A66",
        "#E6331A",
        "#33FFCC",
        "#66994D",
        "#B366CC",
        "#4D8000",
        "#B33300",
        "#CC80CC",
        "#66664D",
        "#991AFF",
        "#E666FF",
        "#4DB3FF",
        "#1AB399",
        "#E666B3",
        "#33991A",
        "#CC9999",
        "#B3B31A",
        "#00E680",
        "#4D8066",
        "#809980",
        "#E6FF80",
        "#1AFF33",
        "#999933",
        "#FF3380",
        "#CCCC00",
        "#66E64D",
        "#4D80CC",
        "#9900B3",
        "#E64D66",
        "#4DB380",
        "#FF4D4D",
        "#99E6E6",
        "#6666FF",
      ],
    },
  ],
});

const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Tên sách", key: "name", align: "start" },
  { title: "Tác giá", key: "author", align: "start" },
  { title: "Danh mục", key: "category_name", align: "start" },
  { title: "Giá (VNĐ)", key: "price", align: "center" },
  { title: "Sản phẩm còn (Quyển)", key: "stock", align: "center" },
  { title: "", key: "actions", align: "center", sortable: false },
];
const DEFAULT_SORT = [{ key: "id", order: "desc" }];
const pageState = reactive({
  itemsPerPage: 10,
  page: 1,
  totalPages: 1,
  loading: true,
  totalItems: 0,
  items: [],
  deleteItem: null,
  editId: "",
  sort: DEFAULT_SORT,
  categories: [],
});

const pageText = computed(() => {
  return `Trang ${pageState.page} / ${pageState.totalPages}`;
});

const options = { plugins: { legend: { display: false } } };

const loadRevenue = async () => {
  const { api } = useApi(undefined, "POST", null, { year: 2024 });
  const { data } = await api<ResponseResultType>("/revenue/monthly");

  if (data.value) {
    const { revenue } = data.value.data;
    testData.labels = revenue.map((item: RevenueItem) => item.month);
    testData.datasets[0].data = revenue.map((item: RevenueItem) => item.total);
  }
};

const loadStatistics = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data } = await api<ResponseResultType>("/statistics");

  if (data.value) {
    const { statistics } = data.value.data;
    commonData.value = statistics;
  }
};

const loadItems = async ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: any;
}) => {
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

  const { data: responseData } = await api<ResponseResultType>(
    `/books?stock=10` + paging + sorting
  );

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { books, pagination } = responseData.value.data;
    pageState.items = books;
    pageState.totalItems = pagination.total;
    pageState.totalPages = pagination.total_pages;
  }

  pageState.loading = false;
};

loadStatistics();
loadRevenue();
loadItems();
</script>

<style scoped>
.Bg1 {
  background-color: #b9e3e7;
  color: #fff;
}
.Bg2 {
  background-color: #ffd564;
  color: #fff;
}
.Bg3 {
  background-color: #44bcf6;
  color: #fff;
}
.Bg4 {
  background-color: #8052ee;
  color: #fff;
}
</style>
