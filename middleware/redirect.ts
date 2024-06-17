import { useAuthStore } from "~/store/authStore"
import { useCartStore } from "~/store/cartStore"

export default defineNuxtRouteMiddleware((to, from) => {
    const cartStore = useCartStore()
    const cartStorage = localStorage.getItem('cart')
    if (cartStore.cart.items.length === 0 && cartStorage) {
        cartStore.cart.items = JSON.parse(cartStorage)
    }
    
    if (to.path === '/register') {
        return
    }

    if (process.client) {
        const token = localStorage.getItem('access_token')
        if (!token && to.path !== '/login' && to.path.startsWith('/admin')) {
            return navigateTo('/login')
        } else if (token && to.path === '/login') {
            return navigateTo('/')
        }
    
        const store = useAuthStore()
    
        if (!store.hasToken) {
            store.setToken(token || '')
        }
    }
  })