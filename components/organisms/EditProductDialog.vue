<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card :loading="loading.detail" :disabled="loading.detail">
      <div class="bg-primary py-3 px-3 d-flex justify-space-between">
        <p>Cập nhât sản phẩm</p>
        <v-icon @click="emits('close')">mdi-close</v-icon>
      </div>
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>

        <v-row>
          <v-col cols="6">
            <v-form
              v-model="form"
              @submit.prevent="onSubmit"
              class="FormWidth mt-3 pb-5 h-100 d-flex flex-column justify-space-between"
            >
              <div>
                <v-text-field
                  v-model="formData.name"
                  :rules="[required]"
                  label="Tên sách"
                  required
                  clearable
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                ></v-text-field>
                <v-text-field
                  v-model="formData.author"
                  :rules="[required]"
                  label="Tác giả"
                  required
                  variant="outlined"
                  density="compact"
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
                  class="mb-3"
                ></v-select>
                <v-text-field
                  v-model="formData.book_cover_url"
                  :rules="[required, url]"
                  label="Ảnh bìa sách"
                  variant="outlined"
                  required
                  clearable
                  density="compact"
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
                  suffix="VNĐ"
                  class="mb-3"
                ></v-text-field>
                <v-text-field
                  v-model="formData.stock"
                  :rules="[required, number]"
                  label="Số lượng tồn kho"
                  variant="outlined"
                  required
                  clearable
                  density="compact"
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
              </div>
              <div class="text-center">
                <v-btn
                  :disabled="!form"
                  color="primary"
                  type="submit"
                  variant="elevated"
                  :loading="loading.submit"
                  >Cập nhật</v-btn
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";

const props = defineProps({
  bookId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["submit", "close"]);

const imgDefault =
  "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
const form = ref(false);
const formData = reactive({
  id: null,
  name: "",
  author: "",
  user_id: 1,
  price: "",
  stock: "",
  book_cover_url: "",
  category_id: 1,
  description: "",
});
const categoryList = ref([]);
const loading = reactive({
  submit: false,
  detail: false,
});
const dialog = ref(false);

const onSubmit = async () => {
  loading.submit = true;
  const { api } = useApi(undefined, "PUT", null, formData);
  const { data: responseData } = await api<ResponseResultType>(`/books`);

  if (responseData) {
    // resetFormData();
  }

  if (responseData.value) {
    const { result } = responseData.value;

    if (!result) {
      emits("submit", false);
    } else {
      emits("submit", true);
    }
  }

  loading.submit = false;
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

const loadDetail = async () => {
  loading.detail = true;

  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(
    `/books/${props.bookId}`
  );

  if (!responseData) {
    return;
  }

  if (responseData.value) {
    const { book } = responseData.value.data;
    formData.id = book.id;
    formData.name = book.name;
    formData.author = book.author;
    formData.user_id = book.user_id;
    formData.price = book.price;
    formData.stock = book.stock;
    formData.book_cover_url = book.book_cover_url;
    formData.category_id = book.category_id;
    formData.description = book.description;
  }

  loading.detail = false;
};

loadCategories();

watch(
  () => props.active,
  () => {
    dialog.value = props.active;
  }
);

watch(
  () => props.bookId,
  () => {
    if (props.bookId) {
      loadDetail();
    }
  }
);
</script>
