<template>
  <div>
    <v-stepper v-if="!ordered" v-model="step">
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item title="Xem trước đơn hàng" value="1" :complete="step > '1'" color="primary">
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item title="Vận chuyển" value="2" :complete="step > '2'" color="primary">
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item title="Xác nhận đơn hàng" value="3" :complete="step > '3'" color="primary">
          </v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item value="1">
            <h3 class="text-h6">Đơn hàng</h3>

            <br />

            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th class="FontBold">Tên sách</th>
                    <th class="text-end FontBold">Số lượng</th>
                    <th class="text-end FontBold">Giá</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(product, index) in products" :key="index">
                    <td v-text="product.name"></td>
                    <td class="text-end">
                      <div class="d-flex justify-end align-center">
                        <v-btn color="primary" density="compact" icon="mdi-plus" @click="plusQuantity(index)"></v-btn>
                        <div class="QuantityText">{{ product.quantity }}</div>
                        <v-btn color="primary" density="compact" icon="mdi-minus" @click="minusQuantity(index)"></v-btn>
                      </div>
                    </td>
                    <td class="text-end" v-text="formatCurrency(product.quantity * product.price)"></td>
                  </tr>

                  <tr>
                    <th>Tổng</th>
                    <th></th>
                    <th class="text-end">{{ formatCurrency(subtotal) }} đ</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-stepper-window-item>

          <v-stepper-window-item value="2">
            <h3 class="text-h6">Giao hàng</h3>
            <br />
            <v-radio-group v-model="shipping.method" label="Phương thức thanh toán"
              color="primary">
              <v-radio label="CODE" value="CASH_ON_DELIVERY"></v-radio>
              <v-radio label="QR Thanh toán" value="QR_CODE"></v-radio>
            </v-radio-group>
            <v-radio-group v-model="shipping.cost" label="Phương thức vận chuyển"
              color="primary">
              <v-radio label="Vận chuyển tiêu chuẩn" value="15000"></v-radio>
              <v-radio label="Vận chuyển ưu tiên" value="30000"></v-radio>
              <v-radio label="Chuyển phát nhanh" value="45000"></v-radio>
            </v-radio-group>
            <h3 class="text-h6">Thông tin giao hàng</h3>
            <br />
            <v-text-field v-model="shipping.customer_name" :rules="[required]" label="Tên người nhận" density="compact"
              variant="outlined" hide-details color="primary" class="mx-4"></v-text-field>
            <br />
            <v-text-field v-model="shipping.address" :rules="[required]" label="Địa chỉ" density="compact"
              variant="outlined" hide-details color="primary" class="mx-4"></v-text-field>
            <br />
            <v-text-field v-model="shipping.customer_phone" :rules="[required, telephone]" label="Số điện thoại" density="compact"
              variant="outlined" color="primary" class="mx-4"></v-text-field>
            <br />
          </v-stepper-window-item>

          <v-stepper-window-item value="3">
            <h3 class="text-h6">Confirm</h3>
            <div class="text-center">
              <img v-if="qrCodeUrl && shipping.method === 'QR_CODE'" :src="qrCodeUrl" class="QrCodeImage"></img>
            </div>
            <br />
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
                  <tr v-for="(product, index) in products" :key="index">
                    <td>
                      <img :src="product.image" :alt="`${index}`" class="ImageCartItem">
                    </td>
                    <td v-text="product.name"></td>
                    <td class="text-end" v-text="product.quantity"></td>
                    <td class="text-end" v-text="formatCurrency(product.quantity * product.price) + ' đ'"></td>
                  </tr>

                  <tr>
                    <td>Phí giao hàng</td>
                    <td></td>
                    <td></td>
                    <td class="text-end" v-text="formatCurrency(Number(shipping.cost)) + ' đ'"></td>
                  </tr>

                  <tr>
                    <th>Tổng</th>
                    <th></th>
                    <th></th>
                    <th class="text-end">{{ formatCurrency(total) }} đ</th>
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
                    <th>Tên người nhận</th>
                    <th class="text-end">{{ shipping.customer_name }}</th>
                  </tr>

                  <tr>
                    <th>Địa chỉ</th>
                    <th class="text-end">{{ shipping.address }}</th>
                  </tr>

                  <tr>
                    <th>Số điện thoại</th>
                    <th class="text-end">{{ shipping.customer_phone }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions color="primary" :disabled="disabled" :next-text="step === '3' ? 'Đặt hàng' : 'Tiếp'" prev-text="Trước"
          @click:next="nextStep" @click:prev="prevStep"></v-stepper-actions>
      </template>
    </v-stepper>

    <v-card v-else>
      <v-sheet class="pa-10 bg-primary d-flex justify-center flex-column align-center">
        <p class="TitleOrderSuccess"><v-icon>mdi-check-circle</v-icon> Đặt hàng thành công</p>
        <div class="mt-5">
          <v-btn variant="outlined" class="mr-5" @click="$router.push('/')">Trang chủ</v-btn>
          <v-btn variant="outlined" @click="$emit('success')">Đơn mua</v-btn>
        </div>
      </v-sheet>
    </v-card>

    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card text="Are you sure you want to delete this item from your cart?" title="Confirmation">
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false" color="primary" variant="elevated">
            Cancel
          </v-btn>

          <v-btn @click="deleteItem(deleteId)" color="primary" variant="outlined">
            Confirm
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/store/cartStore";
import { useAuthStore } from "~/store/authStore";
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";

const authStore = useAuthStore();
const cartStore = useCartStore();
const shipping = reactive({
  cost: "15000",
  customer_name: authStore.profile?.name || "",
  address: authStore.profile?.address || "",
  customer_phone: authStore.profile?.phone || "",
  method: "CASH_ON_DELIVERY",
});
const step = ref("0");
const dialog = ref(false);
const deleteId = ref<number | null>(null);
const ordered = ref(false);
const qrCodeUrl = ref<string | null>(null);

const subtotal = computed(() => {
  return products.value.reduce(
    (acc: number, product: { price: number; quantity: number }) => {
      return acc + product.price * product.quantity;
    },
    0
  );
});

const total = computed(() => {
  return Number(subtotal.value) + Number(shipping.cost);
});

const totalQuantity = computed(() => {
  return products.value.reduce((acc: number, product: { quantity: number }) => {
    return acc + product.quantity;
  }, 0);
});

const products = computed(() => cartStore.cart.items);

const disabled = computed(() => {
  const pattern = /^\d{10}$/;

  if (step.value === "2") {
    if (!shipping.address || !shipping.customer_phone || !shipping.customer_name) {
      return "next";
    }

    if (!pattern.test(shipping.customer_phone)) {
      return "next";
    }
  }

  if (step.value === "0" && totalQuantity.value === 0) {
    return "next";
  }

  if (step.value === "0") {
    return "prev";
  }

  return false;
});

const plusQuantity = (index: number) => {
  products.value[index].quantity++;
};

const minusQuantity = (index: number) => {
  if (products.value[index].quantity === 0) {
    deleteId.value = products.value[index].itemId;
    dialog.value = true;
  }

  if (products.value[index].quantity > 0) {
    products.value[index].quantity--;
  }
};

const deleteItem = (id: number | null) => {
  if (!id) return;
  cartStore.removeCartItem(id);
  dialog.value = false;
};

const submitOrder = async () => {
  const orderData = {
    user_id: authStore.profile?.id,
    status: 'pending',
    total_amount: subtotal.value,
    payment_method: 'CASH_ON_DELIVERY',
    customer_name: shipping.customer_name,
    customer_phone: shipping.customer_phone,
    shipping_cost: Number(shipping.cost),
    shipping_address: shipping.address,
    items: products.value.map((product) => {
      return {
        book_id: product.itemId,
        quantity: product.quantity,
        price: product.price,
        total: product.price * product.quantity,
      };
    }),
  }
  const { api } = useApi(undefined, "POST", null, orderData);
  const { error } = await api<ResponseResultType>(
    `/orders`
  );

  if (error.value) {
    toastError("Đặt hàng thất bại");
  } else {
    toastSuccess("Đặt hàng thành công");
    cartStore.clearCart();
    ordered.value = true;
  }
};

const getQrCode = () => {
  const accountName = 'TRAN DUY PHONG';
  const amount = total.value;
  const addInfo = 'Thanh toan hoa don';
  const BANK_ID = '970415';
  const ACCOUNT_NUMBER = '104877268898';
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NUMBER}-compact.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`

  // const { api } = useApi(undefined, "GET", null, undefined);
  // const { data, error } = await api<ResponseResultType>(
  //   url
  // );
  // console.log(data, error);
  
  // if (error.value) {
  //   toastError("Tạo mã QR thất bại");
  // } else {
  //   qrCodeUrl.value = data;
  // }
};

const nextStep = () => {
  if (step.value === "0") {
    step.value = "2";
  } else if (step.value === "2") {
    if (shipping.method === "QR_CODE") {
      qrCodeUrl.value = getQrCode();
    }
    step.value = "3";
  } else if (step.value === "3") {
    submitOrder()
  }
};

const prevStep = () => {
  if (step.value === "3") {
    step.value = "2";
  } else if (step.value === "2") {
    step.value = "0";
  }
};
</script>

<style lang="scss" scoped>
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

.QrCodeImage {
  width: 300px;
}
</style>
