<template>
  <header class="navbar navbar-expand-md navbar-light d-print-none">
    <div class="container-xl">
      <RouterLink to="/" class="navbar-brand">
        <h2>EItech</h2>
      </RouterLink>

      <div class="navbar-nav flex-row order-md-last">
        <div class="nav-item d-none d-md-flex me-3">
          <a href="/docs" target="_blank" class="nav-link">
  <strong>Docs</strong>
</a>
        </div>

        <div v-if="route.path !== '/login'" class="nav-item d-none d-md-flex me-3">
          <RouterLink to="/settings" class="btn btn-outline-secondary">
            <CgProfile style="margin-right: 4px;" />
            Admin
          </RouterLink>
        </div>

        <div v-if="route.path !== '/login'" class="nav-item d-none d-md-flex">
          <button @click="handleLogout" class="btn btn-outline-danger">
            <CgLogOut style="margin-right: 4px;" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CgProfile, CgLogOut } from 'vue-icons-plus/cg'
import { useAuthStore } from '../store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
