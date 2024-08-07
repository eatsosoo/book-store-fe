<template>
  <div class="BookDetailPage">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Sản phẩm</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row v-if="bookId" class="d-flex justify-center">
        <div class="BookDetailCard">
          <v-row>
            <v-col cols="6">
              <img :src="bookDetail.book_cover_url" alt="book cover" class="w-100" />
            </v-col>
            <v-col cols="6">
              <h2>{{ bookDetail.name }}</h2>
              <p class="mt-2">-- {{ bookDetail.author }} --</p>
              <h2 class="mt-2">{{ formatCurrency(bookDetail.price) }} đ</h2>
              <p class="mt-2 DescriptionDetail"><span class="TextDark">Mô tả sản phẩm</span>: {{ bookDetail.description }}</p>

              <div class="NumberInput">
                <div class="WidthInput">
                  <v-number-input v-model="quantity" dense control-variant="split" variant="outlined"
                    base-color="primary" color="primary" hide-details density="compact" :min="1"
                    :max="bookDetail.stock"></v-number-input>
                </div>
                <h5 class="ml-2">Số lượng sản phẩm: {{ bookDetail.stock }}</h5>
              </div>
              <div class="mt-10">
                <v-btn color="primary" :disabled="!quantity" @click="addToCart">
                  <v-icon class="mr-2">mdi-cart</v-icon>
                  Thêm giỏ hàng
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <h1>Sách không tồn tại</h1>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Đánh giá</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row v-if="bookId" class="d-flex justify-center">
        <div class="BookDetailCard">
          <Review :book-id="bookId"></Review>
        </div>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400" prepend-icon="mdi-update" :text="message" title="Cập nhât quá trình">
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" variant="outlined" color="primary" @click="dialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";
import { useCartStore } from "~/store/cartStore";

definePageMeta({
  layout: "client",
});

const cartStore = useCartStore();
const bookId = Number(useRoute().params.id);
const quantity = ref(1);
const dialog = ref(false);
const message = ref("");

const bookDetail = ref({
  id: bookId,
  name: "",
  author: "",
  price: 0,
  stock: 0,
  category_name: "",
  created_at: "",
  updated_at: "",
  description: "",
  book_cover_url: "",
});

const addToCart = () => {
  dialog.value = true;

  if (cartStore.hasExistBookInCart(bookDetail.value.id)) {
    message.value = "Sách đã tồn tại trong giỏ hàng!";
    return;
  }

  if (quantity.value > bookDetail.value.stock) {
    message.value = "Số lượng sách trong kho không đủ!";
    return;
  }

  const cartItem = {
    itemId: bookDetail.value.id,
    name: bookDetail.value.name,
    price: bookDetail.value.price,
    quantity: quantity.value,
    totalPrice: bookDetail.value.price * quantity.value,
    image: bookDetail.value.book_cover_url,
  };

  cartStore.addToCart(cartItem);
  message.value = "Thêm sách vào giỏ hàng thành công!";
}

const loadItem = async () => {
  if (!bookId) return;
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(`/books/${bookId}`);

  if (responseData.value) {
    const { book } = responseData.value.data;
    bookDetail.value = book;
  }
};

loadItem();
</script>

<style scoped lang="scss">
.BookDetailCard {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 50px 0;
  width: 1000px;
}

.DescriptionDetail {
  color: #aba9a9;
  font-weight: 500;
}

.NumberInput {
  height: 40px;
  width: 300px;
  display: flex;
  margin-top: 60px;
  align-items: center;

  .WidthInput {
    width: 170px;
  }
}

.TextDark {
  color: black;
}
</style>
