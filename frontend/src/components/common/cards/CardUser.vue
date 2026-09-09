<script setup lang="ts">
import { Divider } from 'primevue'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'
import Avatar from '@/components/common/Avatar.vue'

const props = defineProps<{
  user: UserMeResInterface['me'] | null
}>()
</script>

<template>
  <div
    class="rounded-lg lg:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 lg:px-4 lg:py-4"
  >
    <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
      <Avatar
        :username="props.user?.name || 'Usuário autenticado'"
        :src-img="props.user?.avatarUrl || undefined"
      />

      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold text-sm lg:text-base text-slate-900">
          {{ props.user?.name ?? 'Usuário autenticado' }}
        </p>
        <p class="truncate text-xs lg:text-sm text-slate-500">
          {{ props.user?.email ?? 'Detalhes do perfil serão carregados em instantes' }}
        </p>
      </div>
    </div>

    <Divider />

    <dl class="grid gap-2 lg:gap-3 text-xs lg:text-sm">
      <div class="flex flex-col lg:flex-row lg:items-start gap-1 lg:gap-2">
        <dt class="text-slate-500 font-medium">Curso:</dt>
        <dd class="font-medium text-slate-900">
          {{ props.user?.course ?? 'Não informado' }}
        </dd>
      </div>
      <div class="flex flex-col lg:flex-row lg:items-start gap-1 lg:gap-2">
        <dt class="text-slate-500 font-medium">Campus:</dt>
        <dd class="font-medium text-slate-900">
          {{ props.user?.campus ?? 'Não informado' }}
        </dd>
      </div>
    </dl>
  </div>
</template>
