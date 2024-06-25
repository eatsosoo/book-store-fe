<template>
  <v-card class="mx-auto">
    <v-card-text>
      <v-row>
        <v-col cols="3" class="mt-3 MarginFieldSearch">Mã đơn hàng</v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="searchForm.orderCode"
            :loading="props.loading"
            density="compact"
            variant="outlined"
            hide-details
            single-line
            color="primary"
            @update:model-value="$emit('orderCode', $event)"
          ></v-text-field
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="3" class="mt-3 MarginFieldSearch">Tên khách hàng</v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="searchForm.customerName"
            :loading="props.loading"
            density="compact"
            variant="outlined"
            hide-details
            single-line
            color="primary"
            @update:model-value="$emit('customerName', $event)"
          ></v-text-field
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="3" class="mt-3 MarginFieldSearch">Số điện thoại</v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="searchForm.customerPhone"
            :loading="props.loading"
            density="compact"
            variant="outlined"
            hide-details
            single-line
            color="primary"
            @update:model-value="$emit('customerPhone', $event)"
          ></v-text-field
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="3" class="mt-3 MarginFieldSearch">Trạng thái</v-col>
        <v-col cols="4"
          ><v-select
            v-model="searchForm.status"
            :loading="props.loading"
            :items="STATUS_SEARCH"
            item-title="text"
            item-value="value"
            density="compact"
            variant="outlined"
            hide-details
            single-line
            color="primary"
            @update:model-value="$emit('status', $event)"
          ></v-select
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="3" class="mt-3 MarginFieldSearch">Ngày tạo</v-col>
        <v-col cols="4">
          <v-date-input
            v-model="searchForm.dateRange"
            clearable
            variant="outlined"
            color="primary"
            density="compact"
            multiple="range"
            @update:model-value="$emit('dateRange', $event)"
          ></v-date-input>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row class="mt-2 mb-1">
        <v-col cols="3"></v-col>
        <v-col cols="4">
          <v-btn
            :loading="props.loading"
            variant="outlined"
            color="primary"
            class="mx-2"
            @click="$emit('reset'), reset()"
            >Làm mới</v-btn
          >
          <v-btn
            :loading="props.loading"
            variant="elevated"
            color="primary"
            class="mx-2"
            @click="$emit('search')"
            >Tìm kiếm</v-btn
          >
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const STATUS_SEARCH = [
  { text: "Tất cả", value: ""},
  { text: "Chờ xác nhận", value: "pending" },
  { text: "Đã xác nhận", value: "confirmed" },
  { text: "Đang giao hàng", value: "shipping" },
  { text: "Đã giao hàng", value: "delivered" },
  { text: "Đã hủy", value: "cancelled" },
];

const searchForm = reactive({
  orderCode: "",
  customerName: "",
  customerPhone: "",
  status: "",
  dateRange: [],
});

const reset = () => {
  searchForm.orderCode = "";
  searchForm.customerName = "";
  searchForm.customerPhone = "";
  searchForm.status = "";
  searchForm.dateRange = [];
};
</script>
