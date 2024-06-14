import { useAuthStore } from "~/store/authStore"

export default defineNuxtRouteMiddleware((to, from) => {
    console.log(process.client, process.server);
    
    if (to.path === '/register') {
        return
    }

    if (process.client) {
        const token = localStorage.getItem('access_token')
        if (!token && to.path !== '/login') {
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