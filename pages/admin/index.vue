<template>
  <div>
    <h1>Tổng quát</h1>
    <!-- Add your admin page content here -->
     <v-card class="pa-2 mt-5">
      <v-row>
        <v-col cols="3">
          <v-card class="pa-4" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-finance</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Doanh thu tuần này</h3>
                <br>
                <h1>{{ formatCurrency(commonData.revenue_this_week) }} đ</h1>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="pa-4" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-hand-coin</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Số lượng đơn hàng tuần này</h3>
                <br>
                <h1>{{ commonData.orders_this_week }}</h1>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="pa-4" height="150px">
            <v-row>
              <v-col cols="4" >
                <v-icon size="40">mdi-chart-arc</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Doanh thu hôm nay</h3>
                <br>
                <h1>{{ formatCurrency(commonData.revenue_today) }} đ</h1>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="pa-4" height="150px">
            <v-row>
              <v-col cols="4">
                <v-icon size="40">mdi-file-chart-outline</v-icon>
              </v-col>
              <v-col cols="8">
                <h3>Số lượng đơn hàng hôm nay</h3>
                <br>
                <h1>{{ commonData.orders_today }}</h1>
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

const commonData = ref({})
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

const options = { plugins: { legend: { display: false }, } }

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

loadStatistics();
loadRevenue();
</script>

<style scoped>
/* Add your component styles here */
</style>
