import { getProfile, isAuthorized } from "~/composable/useApiFetch";
import { useAuthStore, type User } from "~/store/authStore";
import { useCartStore } from "~/store/cartStore";

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
      const isAuth = await isAuthorized(token);
      const store = useAuthStore();

      if (!isAuth) {
        localStorage.removeItem("access_token");
        store.removeToken();
        store.removeProfile();
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
      return;
    }
  }
});
