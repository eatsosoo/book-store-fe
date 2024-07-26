<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card :loading="loading.detail" :disabled="loading.detail">
      <div class="bg-primary py-3 px-3 d-flex justify-space-between">
        <p>{{ props.authorId !== "" ? "Cập nhật" : "Thêm mới" }} tác giả</p>
        <v-icon @click="close">mdi-close</v-icon>
      </div>
      <v-card-actions class="pa-3">
        <v-row>
          <v-col cols="12">
            <v-form v-model="form" @submit.prevent="onSubmit" class="FormWidth">
              <div>
                <v-text-field v-model="formData.name" :rules="[required]" label="Tên tác giả" required clearable
                  variant="outlined" density="compact" color="primary" class="mb-3"></v-text-field>

                <v-select v-model="formData.nationality" :rules="[required]" :items="NATIONALITY" label="Quốc tịch" variant="outlined"
                  required clearable density="compact" color="primary" class="mb-3"></v-select>

                <v-text-field v-model="formData.dob" :rules="[required, dateOfBirth]" variant="outlined"
                  label="Ngày sinh" placeholder="YYYY-MM-DD" required clearable density="compact" color="primary"
                  class="mb-3"></v-text-field>

                <v-text-field v-model="formData.pseudonym" :rules="[required]" label="Bút danh" variant="outlined"
                  required clearable density="compact" color="primary" class="mb-3"></v-text-field>
              </div>

              <div class="text-center">
                <v-btn :disabled="!form" color="primary" type="submit" variant="elevated" :loading="loading.submit">{{
                  props.authorId !== "" ? "Cập nhật" : "Thêm mới"
                }}</v-btn>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";

const props = defineProps({
  authorId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["submit", "close"]);

const NATIONALITY = ["Việt Nam", "Mỹ", "Anh", "Pháp", "Nga", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Đức", "Ý", "Tây Ban Nha", "Bồ Đào Nha", "Hà Lan", "Thụy Điển", "Na Uy", "Phần Lan", "Thụy Sĩ", "Áo", "Ba Lan", "Séc", "Slovakia", "Hungary", "Rumani", "Bulgaria", "Hy Lạp", "Thổ Nhĩ Kỳ"];

const form = ref(false);
const formData = reactive({
  name: "",
  nationality: "",
  dob: "",
  pseudonym: "",
});
const loading = reactive({
  submit: false,
  detail: false,
});
const dialog = ref(false);

const onSubmit = async () => {
  loading.submit = true;
  const method = props.authorId ? "PUT" : "POST";
  const { api } = useApi(undefined, method, null, {
    id: props.authorId,
    ...formData,
  });
  const { data: responseData, error } = await api<ResponseResultType>(
    `/authors`
  );

  if (error.value) {
    const { errors } = error.value?.data.data;
    toastError(errors.name[0] || "Có lỗi xảy ra. Vui lòng thử lại sau.");
  } else {
    emits("submit");
    close();
    toastSuccess(
      props.authorId !== ""
        ? "Cập nhật tác giả thành công!"
        : "Thêm tác giả thành công!"
    );
  }

  loading.submit = false;
};

const loadDetail = async () => {
  loading.detail = true;

  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(
    `/authors/${props.authorId}`
  );

  if (!responseData) {
    return;
  }

  if (responseData.value) {
    const { author } = responseData.value.data;
    formData.name = author.name;
    formData.nationality = author.nationality;
    formData.dob = author.dob;
    formData.pseudonym = author.pseudonym;
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
  () => props.authorId,
  () => {
    if (props.authorId) {
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
