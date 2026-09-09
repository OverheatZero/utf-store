import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import authRoutes from '@/router/public/authRoutes'
import userRoutes from '@/router/private/userRoutes'
import adsRoutes from '@/router/private/adsRoutes'

const PublicView = () => import('@/views/PublicView/index.vue')
const PrivateView = () => import('@/views/PrivateView/index.vue')

const isAuthenticated = (): boolean => {
  const authStore = useAuthStore()
  return !!authStore.token
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/public/auth/signin',
      beforeEnter: (_to, _from) => {
        if (isAuthenticated()) return { path: '/app', replace: true }
      },
    },

    {
      path: '/public',
      name: 'public',
      component: PublicView,
      beforeEnter: (_to, _from) => {
        if (isAuthenticated()) return { path: '/app', replace: true }
      },
      children: [...authRoutes],
    },

    {
      path: '/app',
      name: 'app',
      component: PrivateView,
      redirect: '/app/users',
      beforeEnter: (_to, _from) => {
        if (!isAuthenticated()) return { path: '/', replace: true }
      },
      children: [...userRoutes, ...adsRoutes],
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
