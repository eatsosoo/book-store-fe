<template>
  <div class="h-screen d-flex justify-center align-center">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      width="448"
      max-height="700"
      rounded="lg"
    >
      <v-img
        class="mx-auto my-6 rounded-circle"
        max-width="150"
        src="https://cdn.dribbble.com/userupload/6810642/file/original-45a54e0571ae13ce154f565f49615607.png?resize=400x0"
      ></v-img>

      <div class="text-subtitle-1 text-medium-emphasis">Tài khoản</div>

      <v-text-field
        v-model="loginForm.email"
        density="compact"
        placeholder="Địa chỉ email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        color="primary"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Mật khẩu

        <a
          class="text-caption text-decoration-none text-primary"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Quên mật khẩu?</a
        >
      </div>

      <v-text-field
        v-model="loginForm.password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Nhập mật khẩu"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        color="primary"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
        class="mb-8 mt-8"
        color="primary"
        size="large"
        variant="elevated"
        block
        @click="login"
      >
        Đăng nhập
      </v-btn>

      <v-card-text class="text-center">
        <NuxtLink class="text-primary text-decoration-none" to="/register">
          Đăng ký ngay <v-icon icon="mdi-chevron-right"></v-icon>
        </NuxtLink>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApi, type ResponseResultType } from "@/composable/useApiFetch";
import { useAuthStore } from "~/store/authStore";

const store = useAuthStore();

const visible = ref(false);

const loginForm = reactive({
  email: "",
  password: "",
});

const login = async () => {
  const { api } = useApi(undefined, "POST", null, { ...loginForm });
  const { data: responseData, error } = await api<ResponseResultType>(`/auth/login`);

  if (error.value) {
    toastError(error.value.data.data.message);
    return;
  }

  if (responseData.value) {
    const { result, data } = responseData.value;
    if (result) {
      toastSuccess(data.message);

      const newToken = data.access_token.split("|")[1];
      localStorage.setItem("access_token", newToken);
      store.setToken(newToken);

      const router = useRouter();
      router.push("/");
    } else {
      toastError(data.message);
    }
  } else {
    toastError("Có lỗi xảy ra. Vui lòng thử lại sau.");
  }
};
</script>
