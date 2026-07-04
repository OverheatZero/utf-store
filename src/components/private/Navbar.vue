<script setup lang="ts">
defineOptions({ name: 'CompPrivateNavbar' })

import Button from 'primevue/button'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'

import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'
import Avatar from '@/components/common/Avatar.vue'

interface Props {
  user: UserMeResInterface['me'] | null
  title: string
}

defineProps<Props>()

const confirm = useConfirm()

const emit = defineEmits<{
  (e: 'menuClick'): void
  (e: 'logout'): void
}>()

function confirmLogout(event: PointerEvent): void {
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
  <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-bars"
          text
          rounded
          severity="secondary"
          class="lg:hidden"
          aria-label="Abrir navegação"
          @click="emit('menuClick')"
        />

        <div class="min-w-0">
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Área privada
          </p>
          <h1 class="truncate text-lg font-semibold text-slate-900">{{ title }}</h1>
        </div>
      </div>

      <div class="w-full flex items-center gap-3">
        <div class="flex-grow-1" />

        <div class="hidden text-right md:block">
          <p class="text-sm font-semibold text-slate-900">
            {{ user?.name ?? 'Carregando perfil' }}
          </p>
          <p class="text-xs text-slate-500">
            {{ user?.email ?? 'Sincronizando dados do usuário' }}
          </p>
        </div>

        <Avatar :username="user?.name" :src-img="user?.avatarUrl" class="max-w-10! max-h-10!" />

        <Button
          icon="pi pi-sign-out"
          class="hidden sm:inline-flex w-20"
          severity="danger"
          variant="outlined"
          rounded
          aria-label="Sair"
          @click="confirmLogout($event)"
        />

        <Button
          icon="pi pi-sign-out"
          class="sm:hidden w-20"
          severity="danger"
          variant="outlined"
          rounded
          aria-label="Sair"
          @click="confirmLogout($event)"
        />

        <ConfirmPopup group="confirmation">
          <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4">
              <span>{{ message.message }}</span>
              <div class="flex items-center gap-2 mt-4">
                <Button label="Sim" @click="acceptCallback" size="small"></Button>
                <Button
                  label="Não"
                  variant="outlined"
                  @click="rejectCallback"
                  severity="secondary"
                  size="small"
                  text
                ></Button>
              </div>
            </div>
          </template>
        </ConfirmPopup>
      </div>
    </div>
  </header>
</template>
