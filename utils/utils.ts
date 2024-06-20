import { useApi, type ResponseResultType } from "~/composable/useApiFetch";
import { useAuthStore } from "~/store/authStore";

export const toastError = (message: string) => {
  useNuxtApp().$toast.error(message);
};

export const toastSuccess = (message: string) => {
  useNuxtApp().$toast.success(message);
};

export const logout = async () => {
  const store = useAuthStore();
  const { api } = useApi(undefined, "POST", store.accessToken, undefined);
  await api<ResponseResultType>(`/auth/logout`);

  store.removeToken();
  localStorage.removeItem("access_token");
};

export const formatCurrency = (number: number) => {
  return number
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace("₫", "")
    .trim();
};
