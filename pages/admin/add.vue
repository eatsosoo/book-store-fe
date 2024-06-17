<template>
  <div class="AdminProducts">
    <h1 class="text-capitalize">thêm sản phẩm</h1>

    <div class="pa-10 bg-white rounded-lg mt-5 BoxShadow">
      <v-row>
        <v-col cols="6">
          <v-form v-model="form" @submit.prevent="onSubmit" class="FormWidth">
            <v-text-field
              v-model="formData.name"
              :rules="[required]"
              label="Tên sách"
              required
              clearable
              variant="outlined"
              density="compact"
              base-color="primary"
              color="primary"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="formData.author"
              :rules="[required]"
              label="Tác giả"
              required
              clearable
              variant="outlined"
              density="compact"
              base-color="primary"
              color="primary"
              class="mb-3"
            ></v-text-field>
            <v-select
              v-model="formData.category_id"
              label="Danh mục"
              :rules="[required]"
              :items="categoryList"
              item-title="name"
              item-value="id"
              required
              clearable
              variant="outlined"
              density="compact"
              base-color="primary"
              color="primary"
              class="mb-3"
            ></v-select>
            <v-text-field
              v-model="formData.book_cover_url"
              :rules="[required, url]"
              label="Bìa sách"
              variant="outlined"
              required
              clearable
              density="compact"
              base-color="primary"
              color="primary"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="formData.price"
              :rules="[required, number]"
              label="Giá"
              variant="outlined"
              required
              clearable
              density="compact"
              base-color="primary"
              color="primary"
              suffix="VNĐ"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="formData.stock"
              :rules="[required, number]"
              type="number"
              label="Số lượng nhập"
              variant="outlined"
              required
              clearable
              density="compact"
              base-color="primary"
              min="0"
              color="primary"
              class="mb-3"
            ></v-text-field>
            <v-textarea
              v-model="formData.description"
              label="Mô tả"
              variant="outlined"
              density="compact"
              base-color="primary"
              color="primary"
              class="mb-3"
            ></v-textarea>
            <div class="text-center">
              <v-btn
                :disabled="!form"
                color="primary"
                type="submit"
                :loading="loading"
                >Thêm mới</v-btn
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

    <v-dialog v-model="dialog.active" width="auto">
      <v-card
        max-width="400"
        :prepend-icon="dialog.icon"
        :text="dialog.message"
        :title="dialog.title"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            color="primary"
            variant="elevated"
            text="Ok"
            @click="dialog.active = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "@/composable/useApiFetch";
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
  description: '',
});
const dialog = reactive({
  active: false,
  message: "Book has been added successfully!",
  icon: "mdi-check-circle-outline",
  title: "Completed",
});
const categoryList = ref([]);
const loading = ref(false);

const resetFormData = () => {
  formData.name = "";
  formData.author = "";
  formData.user_id = 1;
  formData.price = "";
  formData.stock = "";
  formData.book_cover_url = "";
  formData.category_id = 1;
  formData.description = '';
};

const onSubmit = async () => {
  loading.value = true;
  const { api } = useApi(undefined, "POST", null, formData);
  const { data: responseData } = await api<ResponseResultType>(`/books`);

  if (responseData) {
    resetFormData();
  }

  if (responseData.value) {
    const { result } = responseData.value;
    dialog.active = true;

    if (!result) {
      dialog.icon = "mdi-close-circle-outline";
      dialog.message = "Failed to add book!";
      dialog.title = "Error";
    } else {
      dialog.icon = "mdi-check-circle-outline";
      dialog.message = "Book has been added successfully!";
      dialog.title = "Completed";
    }
  }

  loading.value = false;
};

const loadCategories = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(`/categories`);

  if (!responseData) {
    categoryList.value = [];
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
