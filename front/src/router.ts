import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store/auth'

import Dashboard from './views/Dashboard.vue'
import ProductView from './views/ProductView.vue'
import ProductEdit from './views/ProductEdit.vue'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/products/:product_id', 
    name: 'ProductView', 
    component: ProductView, 
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/products/:product_id/edit', 
    name: 'ProductEdit', 
    component: ProductEdit, 
    props: true,
    meta: { requiresAuth: true }
  },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: "/settings", 
    name: 'Settings', 
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/docs',
    name: 'Docs',
    beforeEnter: (to, from, next) => {
      window.location.href = '/docs/index.html'
    }
  },
  {
    path: '/docs/:pathMatch(.*)*',
    beforeEnter: (to, from, next) => {
      window.location.href = `/docs/${to.params.pathMatch || 'index.html'}`
    }
  },
  // 404 fallback
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // Wait for auth initialization if not done yet
  if (!auth.initialized) {
    await auth.restoreSession()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
    return
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (to.name === 'Login' && auth.isLoggedIn) {
    next('/dashboard')
    return
  }

  next()
})

export default router
