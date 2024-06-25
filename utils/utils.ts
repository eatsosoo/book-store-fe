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
};

export const convertStatus = (
  status: "pending" | "processing" | "completed" | "cancelled"
) => {
  switch (status) {
    case "pending":
      return "Đang chờ xử lý";
    case "processing":
      return "Đang giao hàng";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

export const convertDateRange = (dateRange: any[]) => {
  const from = dateRange[0];
  const to = dateRange[dateRange.length - 1];
  const fromDate = from ?  `${formatDate(from)} 00:00:00` : "";
  const toDate = to ? `${formatDate(to)} 23:59:59` : "";
  return `from=${fromDate}&to=${toDate}`;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};
