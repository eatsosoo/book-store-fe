<template>
  <div>
    <v-img
      class="mx-auto my-6 rounded-circle"
      max-width="150"
      src="https://cdn.dribbble.com/userupload/6810642/file/original-45a54e0571ae13ce154f565f49615607.png?resize=400x0"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model="loginForm.email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <a
          class="text-caption text-decoration-none text-primary"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a
        >
      </div>

      <v-text-field
        v-model="loginForm.password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will
          be temporarily locked for three hours. If you must login now, you can
          also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <v-btn class="mb-8" color="primary" size="large" variant="elevated" block @click="login">
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <NuxtLink
          class="text-primary text-decoration-none"
          to="/register"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
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
    const { api } = useApi(undefined, "POST", null, loginForm);
    const { data: responseData } = await api<ResponseResultType>(`/auth/login`);
    
    if (!responseData) {
      toastError('Something wrong. Please try again later.')
    }

    if (responseData.value) {
      const { result, data } = responseData.value
      if (result) {
        toastSuccess(data.message)
        
        const newToken = data.access_token.split('|')[1]
        localStorage.setItem('access_token', newToken)
        store.setToken(newToken)

        const  router = useRouter()
        router.push('/')
      } else {
        toastError(data.message)
      }
    }
};
</script>