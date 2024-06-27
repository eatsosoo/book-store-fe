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
                    <th v-if="formData.status === 'completed'" width="10%"></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(product, index) in formData.items" :key="index">
                    <td>
                      <img :src="product.book_cover_url" :alt="`${index}`" class="ImageCartItem" />
                    </td>
                    <td v-text="product.book_name"></td>
                    <td class="text-end" v-text="product.quantity"></td>
                    <td class="text-end" v-text="formatCurrency(
                      Number(product.quantity) * Number(product.price)
                    ) + ' đ'
                      "></td>
                    <td v-if="formData.status === 'completed'">
                      <v-btn color="primary" density="compact" @click="openRatingForm(product.book_id)">
                        Đánh giá
                      </v-btn>
                    </td>
                  </tr>

                  <tr>
                    <td>Phí giao hàng</td>
                    <td></td>
                    <td></td>
                    <td class="text-end" v-text="formatCurrency(Number(formData.shipping_cost)) + ' đ'
                      "></td>
                    <th v-if="formData.status === 'completed'" width="10%"></th>
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
                    <th class="text-end">{{ formData.customer_name }}</th>
                  </tr>

                  <tr>
                    <th>Địa chỉ</th>
                    <th class="text-end">{{ formData.shipping_address }}</th>
                  </tr>

                  <tr>
                    <th>Số điện thoại</th>
                    <th class="text-end">{{ formData.customer_phone }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="openRating">
      <v-card class="d-flex flex-column mx-auto py-8" elevation="10" height="400" width="360">
        <div class="d-flex justify-center mt-auto text-h5 ">
          Đánh giá sản phẩm
        </div>

        <div class="d-flex align-center flex-column my-auto">
          <v-rating v-model="submitData.star" color="yellow-darken-3"></v-rating>
        </div>

        <div class="mx-5">

          <v-textarea v-model="submitData.content" outlined rows="6" color="primary" variant="outlined"
            class="w-100"></v-textarea>
        </div>
        <div class="text-center">
          <v-btn :loading="loading.rating" color="primary" variant="outlined" @click="openRating = false">Huỷ</v-btn>
          <v-btn :loading="loading.rating" color="primary"
            @click="rating" class="ml-2">{{ submitData.id ? 'Cập nhật' : 'OK' }}</v-btn>
        </div>
      </v-card>
    </v-dialog>

  </v-dialog>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";
import { useAuthStore } from "~/store/authStore";

interface OrderDetail {
  id: number;
  user_id: number;
  customer_name: string;
  customer_phone: string;
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

type Rating = {
  id: number | null;
  star: number;
  content: string;
  order_id: number | null;
  book_id: number | null;
  user_id: number;
};

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

const authStore = useAuthStore();
const formData = ref<OrderDetail>({} as OrderDetail);
const loading = reactive({
  rating: false,
  detail: false,
});
const dialog = ref(false);
const openRating = ref(false);
const submitData = reactive({
  id: null,
  star: 0,
  content: "",
  order_id: null,
  book_id: null,
  user_id: authStore.profile.id,
} as Rating);

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

const rating = async () => {
  loading.rating = true;

  const finalData = {
    ...submitData,
    order_id: props.orderId,
  };
  console.log("final data: ", finalData);
  
  const method = submitData.id ? "PUT" : "POST";
  const { api } = useApi(undefined, method, null, finalData);
  const { error } = await api<ResponseResultType>("/comments");

  if (error.value) {
    toastError("Đánh giá không thành công. Vui lòng thử lại sau.");
  } else {
    toastSuccess("Đánh giá thành công.");
    openRating.value = false;
  }

  loading.rating = false;
};

const resetRatingForm = () => {
  submitData.id = null;
  submitData.star = 0;
  submitData.content = "";
  submitData.order_id = null;
  submitData.book_id = null;
};

const getReview = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(
    `/comments/${props.orderId}/${submitData.book_id}/${submitData.user_id}/find_rating`
  );

  if (!responseData) {
    return;
  }

  if (responseData.value) {
    const { rating } = responseData.value.data;
    if (rating) {
      submitData.id = rating.id;
      submitData.star = rating.star;
      submitData.content = rating.content;
    } else {
      submitData.id = null;
      submitData.star = 0;
      submitData.content = "";
    }
  }
};

const openRatingForm = (bookId: number) => {
  openRating.value = true;
  submitData.book_id = bookId;
  getReview();
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
