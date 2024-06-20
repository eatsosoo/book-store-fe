import { defineStore } from 'pinia'

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  avatar_url: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    profile: {} as User,
  }),
  getters: {
    hasToken: (state) => {
      return state.accessToken !== ''
    },
    getProfile: (state) => {
      return state.profile
    },
    hasProfile: (state) => {
      return Object.keys(state.profile).length > 0
    }
  },
  actions: {
    setToken(token: string) {
      this.accessToken = token
    },
    removeToken() {
      this.accessToken = ''
    },
    setProfile(profile: User) {
      this.profile = profile
    },
    removeProfile() {
      this.profile = {} as User
    },
  },
})
