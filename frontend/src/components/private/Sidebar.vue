<script setup lang="ts">
defineOptions({ name: 'CompPrivateSidebar' })

import { RouterLink } from 'vue-router'
import Drawer from 'primevue/drawer'
import { useConfirm } from 'primevue'

import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'
import CardUser from '@/components/common/cards/CardUser.vue'

interface NavigationItem {
  label: string
  description?: string
  icon: string
  to: string
}

interface Props {
  user: UserMeResInterface['me'] | null
  navigation: NavigationItem[]
  title: string
  subtitle: string
  open: boolean
}

const confirm = useConfirm()
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'logout'): void
}>()

function closeSidebar(): void {
  emit('update:open', false)
}

function confirmLogout(event: Event) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    group: 'confirmation',
    message: 'Realmente deseja sair?',
    icon: 'pi pi-exclamation-circle',
    rejectProps: {
      icon: 'pi pi-times',
      label: 'Não',
      outlined: true,
    },
    acceptProps: {
      icon: 'pi pi-check',
      label: 'Sim',
    },
    accept: () => {
      emit('logout')
    },
    reject: () => {},
  })
}
</script>

<template>
  <aside
    class="hidden w-64 shrink-0 bg-white lg:flex lg:flex-col shadow-[1px_0_10px_rgba(0,0,0,0.05)] border-r border-slate-100 relative z-10"
  >
    <div class="flex h-full flex-col">
      <div class="p-6">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">{{ title }}</h2>
      </div>

      <div class="px-5 mb-2 hidden">
        <CardUser :user="props.user" />
      </div>

      <nav class="flex-1 px-4 space-y-1">
        <RouterLink
          v-for="item in props.navigation"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            class="group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
            :class="
              isActive
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
            "
          >
            <!-- Não renderizamos os ícones se não houver no print, mas os manteremos visualmente discretos -->
            <span class="block">{{ item.label }}</span>
          </a>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <button
          @click="confirmLogout"
          class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors text-left"
        >
          <span class="block font-semibold">Logout</span>
        </button>
      </div>
    </div>
  </aside>

  <Drawer
    :visible="props.open"
    position="left"
    class="w-full max-w-[16rem] lg:hidden"
    :dismissable="true"
    :blockScroll="true"
    @update:visible="emit('update:open', $event)"
  >
    <div class="flex h-full flex-col">
      <div class="p-6">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">{{ title }}</h2>
      </div>

      <div class="px-5 mb-2">
        <CardUser :user="props.user" />
      </div>

      <nav class="flex-1 px-4 space-y-1">
        <RouterLink
          v-for="item in props.navigation"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="
              () => {
                navigate()
                closeSidebar()
              }
            "
            class="group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
            :class="
              isActive
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
            "
          >
            <span class="block">{{ item.label }}</span>
            <span v-if="item.description" class="mt-0.5 block text-xs text-inherit/70">{{
              item.description
            }}</span>
          </a>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <button
          @click="confirmLogout"
          class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors text-left"
        >
          <span class="block font-semibold">Logout</span>
        </button>
      </div>
    </div>
  </Drawer>
</template>
