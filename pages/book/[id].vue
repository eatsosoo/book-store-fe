<template>
  <div class="BookDetailPage">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Book Detail</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row v-if="id" class="d-flex justify-center">
        <div class="BookDetailCard">
          <v-row>
            <v-col cols="6">
              <img
                :src="bookDetail.book_cover_url"
                alt="book cover"
                class="w-100"
              />
            </v-col>
            <v-col cols="6">
              <h2>{{ bookDetail.name }}</h2>
              <p>Author: {{ bookDetail.user_name }}</p>
              <p>Price: ${{ bookDetail.price }}</p>
              <p>Stock: {{ bookDetail.stock }}</p>
              <p>Category: {{ bookDetail.category_name }}</p>
              <p>{{ bookDetail.description }}</p>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
            <h1>Book is not exist</h1>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "~/composable/useApiFetch";

definePageMeta({
  layout: "client",
});

const id = useRoute().params.id;

const bookDetail = ref({
  name: "Book Name",
  user_name: "Author Name",
  price: 0,
  stock: 0,
  category_name: "Category",
  created_at: "2021-09-01",
  updated_at: "2021-09-01",
  description: "Description",
  book_cover_url: "https://via.placeholder.com/300",
});

const loadItem = async () => {
    if (!id) return;
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(`/books/${id}`);

  if (responseData.value) {
    const { book } = responseData.value.data;
    bookDetail.value = book;
  }
};

loadItem();
</script>

<style scoped>
.BookDetailCard {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 50px 0;
    max-width: 1000px;
}
</style>
