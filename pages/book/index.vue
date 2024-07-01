<template>
  <div class="BooksPage">
    <v-container>
      <v-row> </v-row>
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
              cols="3"
              v-for="book in pageState.items"
              :key="book.id"
              class="pa-5"
            >
              <v-card class="mx-auto" max-width="250">
                <v-img
                  height="300px"
                  :src="book.book_cover_url"
                  class="grey lighten-2"
                ></v-img>
                <v-card-title class="Title">{{ book.name }}</v-card-title>
                <v-card-subtitle class="Author">{{
                  book.author
                }}</v-card-subtitle>
                <v-card-subtitle class="Author">{{
                  book.category_name
                }}</v-card-subtitle>
                <p class="Price">{{ formatCurrency(book.price) }} đ</p>
                <v-card-actions class="d-flex justify-center my-4">
                  <v-btn
                    :disabled="book.quantity <= 0"
                    color="primary"
                    variant="elevated"
                    @click="addToCart(book)"
                    >Thêm giỏ hàng</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-pagination
                v-model="pageState.page"
                :length="pageState.totalPages"
                color="primary"
                variant="elevated"
                size="small"
                @update:modelValue="loadItems({ page: $event, itemsPerPage: pageState.itemsPerPage, sortBy: pageState.sort })"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        :text="message"
        title="Cập nhât quá trình"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            variant="outlined"
            color="primary"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "@/composable/useApiFetch";
import { useCartStore } from "~/store/cartStore";

definePageMeta({
  layout: "client",
});

type BookType = {
  id: number;
  name: string;
  price: number;
  book_cover_url: string;
  author: string;
  category_name: string;
  quantity: number;
};

const cartStore = useCartStore();
const DEFAULT_SORT = [{ key: "id", order: "desc" }];
const pageState = reactive({
  itemsPerPage: 20,
  page: 1,
  totalPages: 1,
  loading: true,
  totalItems: 0,
  items: [] as BookType[],
  sort: [],
  categories: [],
});
const searchForm = reactive({
  bookName: "",
  author: "",
  categoryId: "",
});
const dialog = ref(false);
const message = ref("");

//--------------------------

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
    paging = "pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
  }

  if (sortBy && sortBy.length) {
    sorting += "&sort=" + JSON.stringify(sortBy[0]);
  } else {
    sorting += "&sort=" + JSON.stringify(DEFAULT_SORT[0]);
  }

  const params = `name=${searchForm.bookName}&author=${searchForm.author}&category_id=${searchForm.categoryId}`;

  const { data: responseData } = await api<ResponseResultType>(
    `/books?` + paging + sorting
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

const addToCart = (bookDetail: BookType) => {
  dialog.value = true;

  if (cartStore.hasExistBookInCart(bookDetail.id)) {
    message.value = "Sách đã tồn tại trong giỏ hàng!";
    return;
  }

  const cartItem = {
    itemId: bookDetail.id,
    name: bookDetail.name,
    price: bookDetail.price,
    quantity: 1,
    totalPrice: bookDetail.price * 1,
    image: bookDetail.book_cover_url,
  };

  cartStore.addToCart(cartItem);
  message.value = "Thêm sách vào giỏ hàng thành công!";
};

const loadCategories = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(`/categories`);

  if (!responseData) {
    pageState.categories = [];
  }

  if (responseData.value) {
    const { categories } = responseData.value.data;
    pageState.categories = categories;
  }
};

loadCategories();
loadItems({
  page: 1,
  itemsPerPage: pageState.itemsPerPage,
  sortBy: DEFAULT_SORT,
});
</script>

<style lang="scss">
.Title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.Author {
  font-size: 12px;
}

.Price {
  font-size: 14px;
  font-weight: bold;
  color: black !important;
  padding: 0 15px;
}
</style>
