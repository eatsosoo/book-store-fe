<template>
  <v-dialog v-model="dialog" max-width="1000" persistent>
    <v-card :loading="loading.detail" :disabled="loading.detail">
      <div class="bg-primary py-3 px-3 d-flex justify-space-between">
        <p>Chi tiết đơn hàng</p>
        <v-icon @click="close">mdi-close</v-icon>
      </div>
      <v-card-actions class="pa-3">
        <v-row>
          <v-col cols="12">
            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th class="FontBold">Ảnh bìa</th>
                    <th class="FontBold">Tên sách</th>
                    <th class="text-end FontBold">Số lượng</th>
                    <th class="text-end FontBold">Giá</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(product, index) in formData.items" :key="index">
                    <td>
                      <img
                        :src="product.book_cover_url"
                        :alt="`${index}`"
                        class="ImageCartItem"
                      />
                    </td>
                    <td v-text="product.book_name"></td>
                    <td class="text-end" v-text="product.quantity"></td>
                    <td
                      class="text-end"
                      v-text="
                        formatCurrency(
                          Number(product.quantity) * Number(product.price)
                        ) + ' đ'
                      "
                    ></td>
                  </tr>

                  <tr>
                    <td>Phí giao hàng</td>
                    <td></td>
                    <td></td>
                    <td
                      class="text-end"
                      v-text="
                        formatCurrency(Number(formData.shipping_cost)) + ' đ'
                      "
                    ></td>
                  </tr>

                  <tr>
                    <th>Tổng</th>
                    <th></th>
                    <th></th>
                    <th class="text-end">
                      {{
                        formatCurrency(
                          Number(formData.total_amount) +
                            Number(formData.shipping_cost)
                        )
                      }}
                      đ
                    </th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>

            <br></br>

            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th class="FontBold">Thông tin giao hàng</th>
                    <th class="text-end FontBold">Chi tiết</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th>Tên khách hàng</th>
                    <th class="text-end">{{ formData.user_name }}</th>
                  </tr>

                  <tr>
                    <th>Địa chỉ</th>
                    <th class="text-end">{{ formData.shipping_address }}</th>
                  </tr>

                  <tr>
                    <th>Số điện thoại</th>
                    <th class="text-end">{{ formData.user_phone }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";

interface OrderDetail {
  id: number;
  user_id: number;
  user_name: string;
  user_phone: string;
  order_code: string;
  status: string;
  total_amount: string;
  payment_method: string;
  shipping_address: string;
  shipping_cost: string;
  items: {
    order_id: number;
    book_id: number;
    book_name: string;
    book_cover_url: string;
    quantity: number;
    price: string;
    total: string;
  }[];
  created_at: string;
  updated_at: string;
}

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["submit", "close"]);

const formData = ref<OrderDetail>({} as OrderDetail);
const loading = reactive({
  submit: false,
  detail: false,
});
const dialog = ref(false);

const loadDetail = async () => {
  loading.detail = true;

  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(
    `/orders/${props.orderId}`
  );

  if (!responseData) {
    return;
  }

  if (responseData.value) {
    const { order } = responseData.value.data;
    formData.value = order;
  }

  loading.detail = false;
};

const close = () => {
  formData.value = {} as OrderDetail;
  dialog.value = false;
  emits("close");
};

watch(
  () => props.active,
  () => {
    dialog.value = props.active;
  }
);

watch(
  () => props.orderId,
  () => {
    if (props.orderId) {
      loadDetail();
    }
  }
);
</script>

<style lang="scss" scoped>
.FieldWidth {
  width: 300px;
}
.FontBold {
  font-weight: bold !important;
}

.v-text-field {
  width: 300px;
}

.QuantityText {
  text-align: center;
  width: 50px;
}

.ImageCartItem {
  width: 50px;
  margin-top: 5px;
}

.TitleOrderSuccess {
  font-size: 24px;
  font-weight: 500;
}
</style>
