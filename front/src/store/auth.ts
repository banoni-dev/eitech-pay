import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminName: null as string | null,
    isLoggedIn: false,
    loading: false,
    initialized: false,
  }),

  actions: {
    async login(username: string, password: string, captcha?: string) {
      this.loading = true;
      try {
        const res = await authService.login({ username, password, captcha });
        this.isLoggedIn = true;
        this.adminName = res.adminName ?? null;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      authService.logout();
      this.isLoggedIn = false;
      this.adminName = null;
    },

    async restoreSession() {
      const token = authService.getToken();
      if (!token) {
        this.initialized = true;
        return;
      }

      try {
        const res = await authService.checkSession();
        this.adminName = res.adminName;
        this.isLoggedIn = true;
      } catch {
        this.logout();
      } finally {
        this.initialized = true;
      }
    }
  }
});
