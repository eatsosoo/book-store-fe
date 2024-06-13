<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card :loading="loading.detail" :disabled="loading.detail">
      <div class="bg-primary py-2 px-3 d-flex justify-space-between">
        <p>Edit book</p>
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
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                  disabled
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
              </div>
              <div class="text-center">
                <v-btn
                  :disabled="!form"
                  color="primary"
                  type="submit"
                  variant="elevated"
                  :loading="loading.submit"
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
    formData.author = book.user_name;
    formData.user_id = book.user_id;
    formData.price = book.price;
    formData.stock = book.stock;
    formData.book_cover_url = book.book_cover_url;
    formData.category_id = book.category_id;
  }

  loading.detail = false;
};

loadCategories();
console.log(props);

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
