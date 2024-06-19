<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card :loading="loading.detail" :disabled="loading.detail">
      <div class="bg-primary py-2 px-3 d-flex justify-space-between">
        <p>{{ props.categoryId !== "" ? "Cập nhât" : "Thêm mới" }} danh mục</p>
        <v-icon @click="close">mdi-close</v-icon>
      </div>
      <v-card-actions class="pa-3">
        <v-row>
          <v-col cols="6">
            <v-form v-model="form" @submit.prevent="onSubmit" class="FormWidth">
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
                  v-model="formData.image_url"
                  :rules="[required, url]"
                  label="Ảnh bìa sách"
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
                  >{{
                    props.categoryId !== "" ? "Cập nhật" : "Thêm mới"
                  }}</v-btn
                >
              </div>
            </v-form>
          </v-col>
          <v-col cols="6">
            <img
              :src="formData.image_url || imgDefault"
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
  categoryId: {
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
  name: "",
  image_url: "",
});
const loading = reactive({
  submit: false,
  detail: false,
});
const dialog = ref(false);

const onSubmit = async () => {
  loading.submit = true;
  const method = props.categoryId ? "PUT" : "POST";
  const { api } = useApi(undefined, method, null, {
    id: props.categoryId,
    ...formData,
  });
  const { data: responseData, error } = await api<ResponseResultType>(
    `/categories`
  );

  if (error.value) {
    const { errors } = error.value?.data.data;
    toastError(errors.name[0] || "Có lỗi xảy ra. Vui lòng thử lại sau.");
  } else {
    emits("submit");
    close();
    toastSuccess(
      props.categoryId !== ""
        ? "Cập nhật danh mục thành công!"
        : "Thêm danh mục thành công!"
    );
  }

  loading.submit = false;
};

const loadDetail = async () => {
  loading.detail = true;

  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(
    `/categories/${props.categoryId}`
  );

  if (!responseData) {
    return;
  }

  if (responseData.value) {
    const { category } = responseData.value.data;
    formData.name = category.name;
  }

  loading.detail = false;
};

const close = () => {
  formData.name = "";
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
  () => props.categoryId,
  () => {
    if (props.categoryId) {
      loadDetail();
    }
  }
);
</script>

<style lang="scss" scoped>
.FieldWidth {
  width: 300px;
}
</style>
