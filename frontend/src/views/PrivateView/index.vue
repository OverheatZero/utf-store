<script setup lang="ts">
defineOptions({ name: 'PrivateViewLayout' })

import { ref } from 'vue'

import Navbar from '@/components/private/Navbar.vue'
import Sidebar from '@/components/private/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

const sidebarOpen = ref(false)

const navigation = [
  {
    label: 'Usuários',
    icon: 'pi pi-users',
    to: '/admin/users',
  },
  {
    label: 'Anúncios',
    icon: 'pi pi-bell',
    to: '/admin/ads',
  },
]

function logout() {
  authStore.$reset()
}
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9] lg:flex">
    <Sidebar
      v-model:open="sidebarOpen"
      :user="userStore.user"
      :navigation="navigation"
      title="UTF-Store Admin"
      subtitle=""
      @logout="logout"
    />

    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <div class="lg:hidden">
        <Navbar
          :user="userStore.user"
          title="UTF-Store Admin"
          @menu-click="sidebarOpen = true"
          @logout="logout"
        />
      </div>

      <main class="flex-1 space-y-6 p-4">
        <slot />
        <router-view />
      </main>
    </div>
  </div>
</template>
