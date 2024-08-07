<template>
  <div class="h-screen d-flex justify-center align-center">
    <v-card
      class="mx-auto my-auto pa-12 pb-8"
      elevation="8"
      width="448"
      max-height="700"
      rounded="lg"
    >
      <h1 class="mb-2">Đăng ký tài khoản</h1>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <div class="text-subtitle-1 text-medium-emphasis">Tên người dùng</div>

        <v-text-field
          v-model="registerForm.name"
          :rules="[required]"
          density="compact"
          prepend-inner-icon="mdi-account-circle"
          variant="outlined"
          base-color="primary"
          color="primary"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">Email</div>

        <v-text-field
          v-model="registerForm.email"
          :rules="[required, email]"
          density="compact"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          base-color="primary"
          color="primary"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Mật khẩu
        </div>

        <v-text-field
          v-model="registerForm.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          :rules="[required, minLength(registerForm.password, 6)]"
          density="compact"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          base-color="primary"
          color="primary"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">Địa chỉ</div>

        <v-text-field
          v-model="registerForm.address"
          :rules="[required]"
          density="compact"
          prepend-inner-icon="mdi-map-marker"
          variant="outlined"
          base-color="primary"
          color="primary"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">Số điện thoại</div>

        <v-text-field
          v-model="registerForm.phone"
          :rules="[required, telephone]"
          density="compact"
          prepend-inner-icon="mdi-phone"
          variant="outlined"
          base-color="primary"
          color="primary"
        ></v-text-field>

        <v-btn
          :disabled="!form"
          :loading="loading"
          class="mb-8 mt-8"
          color="primary"
          size="large"
          variant="elevated"
          block
          type="submit"
        >
          Đăng ký
        </v-btn>

        <v-card-text class="text-center">
          <NuxtLink class="text-primary text-decoration-none" to="/login">
            Đăng nhập ngay <v-icon icon="mdi-chevron-right"></v-icon>
          </NuxtLink>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApi, type ResponseResultType } from "@/composable/useApiFetch";

const form = ref(false);
const visible = ref(false);
const loading = ref(false);
const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  address: "",
  phone: "",
});

const reset = () => {
  registerForm.name = "";
  registerForm.email = "";
  registerForm.password = "";
  registerForm.address = "";
  registerForm.phone = "";
};

const onSubmit = async () => {
  loading.value = true;
  const { api } = useApi(undefined, "POST", null, {...registerForm});
  const { data: responseData, error } = await api<ResponseResultType>(`/register`);
  loading.value = false;
  
  if (error.value) {
    const { errors } = error.value?.data.data;
    toastError(errors.email[0] || errors.password[0] || errors.name[0] || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    return;
  }
  
  if (responseData.value) {
    const { data } = responseData.value;
    if (data) {
      toastSuccess('Đăng ký thành công.');
      const router = useRouter();
      router.push("/login");
    } else {
      toastError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  }
};
</script>
