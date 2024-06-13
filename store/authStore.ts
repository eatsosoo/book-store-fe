import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
  }),
  getters: {
    hasToken: (state) => {
      return state.accessToken !== ''
    },
  },
  actions: {
    setToken(token: string) {
      // `this` is the store instance
      this.accessToken = token
    },
    removeToken() {
      this.accessToken = ''
    }
  },
})
