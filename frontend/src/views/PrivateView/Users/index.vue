<script setup lang="ts">
defineOptions({ name: 'PrivateUsers' })

import { computed, ref } from 'vue'

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import CheckCircleIcon from '@/components/common/icons/CheckCircleIcon.vue'
import MinusIcon from '@/components/common/icons/MinusIcon.vue'
import Avatar from '@/components/common/Avatar.vue'
import TrashIcon from '@/components/common/icons/TrashIcon.vue'

import { useUserStore } from '@/stores/user'
import type UserFindAllResInterface from '@/domain/user/types/res/UserFindAllResInterface'
import type { UserRoleType } from '@/domain/user/types/UserRoleType'

const toast = useToast()
const confirm = useConfirm()
const userStore = useUserStore()

const ROLE_META: Record<UserRoleType, { label: string; severity: 'info' | 'warn' }> = {
  admin: { label: 'Administrador', severity: 'info' },
  client: { label: 'Usuário', severity: 'warn' },
}

const users = ref<UserFindAllResInterface[]>([])

const filters = ref({
  global: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
})

const roleFilter = ref<UserRoleType | null>(null)
const roleOptions = (Object.keys(ROLE_META) as UserRoleType[]).map((value) => ({
  value,
  label: ROLE_META[value].label,
}))

const filteredUsers = computed(() =>
  roleFilter.value ? users.value.filter((user) => user.role === roleFilter.value) : users.value,
)

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})
function formatDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

function confirmDelete(user: UserFindAllResInterface): void {
  confirm.require({
    header: 'Excluir usuário',
    message: `Tem certeza que deseja excluir "${user.name}"? Esta ação não poderá ser desfeita.`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Excluir', severity: 'danger' },
    accept: () => deleteUser(user),
  })
}

async function deleteUser(user: UserFindAllResInterface): Promise<void> {
  try {
    await userStore.actDeleteUser(user.id)
    handleDeleteUserByList(user.id)
    toast.add({
      severity: 'success',
      summary: 'Usuário excluído',
      detail: `${user.name} foi removido com sucesso.`,
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro ao deletar usuário',
      detail: 'Não foi possível deletar o usuário.',
      life: 3000,
    })
  }
}

function handleDeleteUserByList(userId: string) {
  users.value = users.value.filter((user) => user.id !== userId)
}

async function fetchUsers(): Promise<void> {
  try {
    const { data } = await userStore.actFindAllUsers()
    users.value = data
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar usuários',
      detail: 'Não foi possível carregar a lista de usuários.',
      life: 3000,
    })
  }
}

fetchUsers()
</script>

<template>
  <section class="space-y-6">
    <header
      class="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100"
    >
      <h1 class="text-xl font-bold text-slate-900 tracking-tight">Usuários</h1>
    </header>

    <ConfirmDialog />

    <div
      class="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100"
    >
      <DataTable
        v-model:filters="filters"
        :value="filteredUsers"
        data-key="id"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 25, 50]"
        :global-filter-fields="['name', 'email', 'course', 'campus']"
        removable-sort
        :row-hover="true"
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <IconField class="w-full sm:max-w-md">
              <InputIcon class="pi pi-search text-slate-400" />
              <InputText
                v-model="filters.global.value"
                placeholder="Pesquise aqui"
                class="w-full rounded-xl bg-slate-50 border-none px-10 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </IconField>

            <Select
              v-model="roleFilter"
              :options="roleOptions"
              option-label="label"
              option-value="value"
              placeholder="Todos os status"
              show-clear
              class="w-full sm:w-56 rounded-xl bg-slate-50 border-none shadow-none"
            />
          </div>
        </template>

        <template #empty>
          <div class="py-8 text-center text-slate-500">Nenhum usuário encontrado.</div>
        </template>

        <Column
          field="id"
          header="Código"
          sortable
          class="text-sm font-semibold text-slate-700 w-24"
        >
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <Tag
                v-if="userStore.user?.id === data?.id"
                icon="pi pi-user"
                severity="info"
                v-tooltip.top="'Você'"
              />
              <div class="w-full max-w-42 truncate" v-tooltip="data.id">
                <span class="text-slate-500">{{ data.id }}</span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="name" header="Nome" sortable class="text-sm font-semibold text-slate-700">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <Avatar
                :username="data.name"
                :src-img="data.avatarUrl || undefined"
                class="w-8 h-8"
              />
              <div class="min-w-0">
                <p class="truncate font-medium text-slate-900" v-tooltip="data.name">
                  {{ data.name }}
                </p>
                <p class="truncate text-xs text-slate-500" v-tooltip="data.email">
                  {{ data.email }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="course" header="Curso" sortable class="text-sm font-semibold">
          <template #body="{ data }">
            <div class="w-full max-w-42 truncate" v-tooltip="data.course">
              <span class="text-slate-600 capitalize font-medium">{{ data.course }}</span>
            </div>
          </template>
        </Column>

        <Column field="campus" header="Campus" sortable class="text-sm font-semibold">
          <template #body="{ data }">
            <div class="w-full max-w-42 truncate" v-tooltip="data.campus">
              <span class="text-slate-600 capitalize font-medium">{{ data.campus }}</span>
            </div>
          </template>
        </Column>

        <Column field="role" header="Papel" sortable class="text-sm font-semibold text-slate-700">
          <template #body="{ data }">
            <Tag
              :severity="ROLE_META[data.role as UserRoleType].severity"
              :value="ROLE_META[data.role as UserRoleType].label"
              rounded
            />
          </template>
        </Column>

        <Column field="createdAt" header="Criado em" sortable class="text-sm font-semibold">
          <template #body="{ data }">
            <span class="text-slate-600 capitalize font-medium">{{
              formatDate(data.createdAt)
            }}</span>
          </template>
        </Column>

        <Column
          field="isVerified"
          header="Ativo"
          sortable
          class="text-sm font-semibold text-slate-700 text-center w-24"
        >
          <template #body="{ data }">
            <CheckCircleIcon v-if="data.isVerified" class="stroke-green-700" />
            <MinusIcon v-else class="stroke-orange-500" />
          </template>
        </Column>

        <Column header="" class="w-16 text-center">
          <template #body="{ data }">
            <Button
              v-if="userStore.user?.id != data?.id"
              severity="danger"
              aria-label="Excluir usuário"
              v-tooltip.left="'Excluir usuário'"
              @click="confirmDelete(data)"
              size="small"
              variant="outlined"
            >
              <TrashIcon />
            </Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </section>
</template>
