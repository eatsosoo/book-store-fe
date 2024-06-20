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

export const formatNumberPhone = (phone: string) => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

export const convertStatus = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
  switch (status) {
    case 'pending':
      return 'Đang chờ xử lý';
    case 'processing':
      return 'Đang giao hàng';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
}
