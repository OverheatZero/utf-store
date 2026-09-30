import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

import authRoutes from '@/router/public/authRoutes'
import userRoutes from '@/router/admin/userRoutes'
import adsRoutes from '@/router/admin/adsRoutes'
import listingRoutes from './client/listingRoutes'

const PublicView = () => import('@/views/PublicView/index.vue')
const PrivateView = () => import('@/views/PrivateView/index.vue')

const isAuthenticated = (): boolean => {
  const authStore = useAuthStore()
  return !!authStore.token
}

const getUserRole = (): string | undefined => {
  const userStore = useUserStore()
  return userStore.user?.role
}

const loadAuthenticatedUser = async (): Promise<boolean> => {
  const userStore = useUserStore()
  if (userStore.user) return true

  try {
    await userStore.actMe()
    return !!userStore.user
  } catch {
    return false
  }
}

const getHomeByRole = (): string => {
  return getUserRole() === 'admin' ? '/admin/users' : '/app/listings'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => (isAuthenticated() ? getHomeByRole() : '/public/auth/signin'),
    },

    {
      path: '/public',
      name: 'public',
      component: PublicView,
      beforeEnter: () => {
        if (isAuthenticated()) return { path: getHomeByRole(), replace: true }
      },
      children: [...authRoutes],
    },

    {
      path: '/admin',
      name: 'admin',
      component: PrivateView,
      redirect: '/admin/users',
      beforeEnter: async () => {
        if (!isAuthenticated()) return { path: '/public/auth/signin', replace: true }
        if (!(await loadAuthenticatedUser())) return { path: '/public/auth/signin', replace: true }
        if (getUserRole() !== 'admin') return { path: '/app/listings', replace: true }
      },
      children: [...userRoutes, ...adsRoutes],
    },

    {
      path: '/app',
      name: 'app',
      component: PrivateView,
      redirect: '/app/listings',
      beforeEnter: async (_to, _from) => {
        if (!isAuthenticated()) return { path: '/public/auth/signin', replace: true }
        if (!(await loadAuthenticatedUser())) return { path: '/public/auth/signin', replace: true }
        if (getUserRole() === 'admin') return { path: '/admin', replace: true }
      },
      children: [...listingRoutes],
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
