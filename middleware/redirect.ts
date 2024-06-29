import { getProfile, isAuthorized } from "~/composable/useApiFetch";
import { useAuthStore, type User } from "~/store/authStore";
import { useCartStore } from "~/store/cartStore";

const ADMIN = 1;
const EMPLOYEE = 2;
const USER = 3;

export default defineNuxtRouteMiddleware(async (to, from) => {
  const cartStore = useCartStore();
  const cartStorage = localStorage.getItem("cart");
  if (cartStore.cart.items.length === 0 && cartStorage) {
    cartStore.cart.items = JSON.parse(cartStorage);
  }

  if (to.path === "/register") {
    return;
  }

  if (process.client) {
    const token = localStorage.getItem("access_token");
    if (!token && to.path !== "/login" && to.path.startsWith("/admin")) {
      return navigateTo("/login");
    } else if (token && to.path === "/login") {
      return navigateTo("/");
    } else if (token && to.path !== "/login") {
      const authData = await isAuthorized(token);
      const store = useAuthStore();

      if (!authData) {
        localStorage.removeItem("access_token");
        store.removeToken();
        store.removeProfile();
        store.removeRoleAndPermissions();
        return navigateTo("/login");
      }

      if (!store.hasToken) {
        store.setToken(token || "");
      }

      if (!store.hasProfile) {
        const profile = await getProfile(token);
        if (profile) {
          store.setProfile(profile as User);
        }
      }

      const { role, permissions } = authData.data;
      store.setRoleAndPermissions(role, permissions);

      // Prevent infinite redirect by checking if the current path is not already the target path
      if (role === ADMIN && from.path.startsWith("/login") && to.path !== "/admin") {
        return navigateTo("/admin");
      }

      if (role === EMPLOYEE && from.path.startsWith("/login") && to.path !== "/admin") {
        return navigateTo("/admin");
      }

      if (role === USER && to.path.startsWith("/admin") && to.path !== "/") {
        return navigateTo("/");
      }

      return;
    }
  }
});
