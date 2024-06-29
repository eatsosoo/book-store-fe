<template>
  <div>
    <h1>Tổng quát</h1>
    <!-- Add your admin page content here -->

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

loadRevenue();
</script>

<style scoped>
/* Add your component styles here */
</style>
