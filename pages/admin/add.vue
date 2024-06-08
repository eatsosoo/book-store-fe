<template>
  <div class="AdminProducts">
    <h1 class="text-capitalize">new product</h1>

    <div class="pa-10 bg-white rounded-lg mt-5 BoxShadow">
      <v-row>
        <v-col cols="6">
          <v-form v-model="form" @submit.prevent="onSubmit" class="FormWidth">
            <v-text-field
              v-model="formData.name"
              :rules="[required]"
              label="Name of book"
              required
              clearable
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="formData.author"
              :rules="[required]"
              label="Author of book"
              required
              clearable
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-select
              v-model="formData.category_id"
              label="Category"
              :rules="[required]"
              :items="categoryList"
              item-title="name"
              item-value="id"
              required
              clearable
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-select>
            <v-text-field
              v-model="formData.book_cover_url"
              :rules="[required, url]"
              label="Book cover"
              variant="outlined"
              required
              clearable
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="formData.price"
              :rules="[required, number]"
              label="Price"
              variant="outlined"
              required
              clearable
              density="compact"
              prefix="$"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="formData.stock"
              :rules="[required, number]"
              label="Stock"
              variant="outlined"
              required
              clearable
              density="compact"
              class="mb-3"
            ></v-text-field>
            <div class="text-center">
              <v-btn
                :disabled="!form"
                color="primary"
                type="submit"
                :loading="loading"
                >Submit</v-btn
              >
            </div>
          </v-form>
        </v-col>
        <v-col cols="6">
          <img
            :src="formData.book_cover_url || imgDefault"
            alt="book cover"
            class="w-100"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { useApi } from "@/composable/useApiFetch";
import { reactive, ref } from "vue";

definePageMeta({
  layout: "admin",
});

const imgDefault =
  "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
const form = ref(false);
const formData = reactive({
  name: "",
  author: "",
  user_id: 1,
  price: "",
  stock: "",
  book_cover_url: "",
  category_id: 1,
});
const categoryList = ref([]);
const loading = ref(false);

const required = (v) => {
  return !!v || "Field is required";
};

const number = (v) => {
  return /^\d+$/.test(v) || "Field must be a number";
};

const url = (v) => {
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return pattern.test(v) || "Invalid URL";
};

const onSubmit = async () => {
  loading.value = true;
  const { api } = useApi(undefined, "POST", null, formData);
  const { data: responseData } = await api(`/books`);

  console.log(responseData);
  loading.value = false;
};

const loadCategories = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api(`/categories`);

  if (!responseData) {
    categories.value = [];
  }

  if (responseData.value) {
    const { categories } = responseData.value.data;
    categoryList.value = categories;
  }
};

loadCategories();
</script>

<style>
.BoxShadow {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
</style>
