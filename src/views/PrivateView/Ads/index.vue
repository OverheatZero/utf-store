<script setup lang="ts">
defineOptions({ name: 'PrivateAds' })

import { computed, ref } from 'vue'

import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataView from 'primevue/dataview'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Carousel from 'primevue/carousel'
import ConfirmDialog from 'primevue/confirmdialog'

import { useListingStore } from '@/stores/listing'
import type ListingInterface from '@/domain/listing/types/ListingInterface'

const toast = useToast()
const confirm = useConfirm()
const listingStore = useListingStore()

const STATUS_META: Record<string, { label: string; severity: 'success' | 'secondary' }> = {
  ACTIVE: { label: 'Ativo', severity: 'success' },
  INACTIVE: { label: 'Inativo', severity: 'secondary' },
}

const CONDITION_META: Record<string, string> = {
  NEW: 'Novo',
  USED: 'Usado',
}

const TYPE_META: Record<string, string> = {
  PRODUCT: 'Produto',
  SERVICE: 'Serviço',
}

function statusMeta(status: string): { label: string; severity: 'success' | 'secondary' } {
  return STATUS_META[status] ?? { label: status, severity: 'secondary' }
}
function conditionLabel(condition: string): string {
  return CONDITION_META[condition] ?? condition
}
function typeLabel(type: string): string {
  return TYPE_META[type] ?? type
}

const listings = ref<ListingInterface[]>([])
const loading = ref(false)

const search = ref('')
const statusFilter = ref<string | null>(null)
const categoryFilter = ref<string | null>(null)

const statusOptions = Object.entries(STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

const categoryOptions = computed(() => {
  const map = new Map<string, string>()
  for (const listing of listings.value) map.set(listing.categoryId, listing.category.name)
  return [...map].map(([value, label]) => ({ value, label }))
})

const filteredListings = computed(() => {
  const term = search.value.trim().toLowerCase()

  return listings.value.filter((listing) => {
    const matchesTerm =
      !term ||
      listing.title.toLowerCase().includes(term) ||
      (listing.description?.toLowerCase().includes(term) ?? false) ||
      (listing.location?.toLowerCase().includes(term) ?? false) ||
      listing.seller.name.toLowerCase().includes(term) ||
      listing.category.name.toLowerCase().includes(term)
    const matchesStatus = !statusFilter.value || listing.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || listing.categoryId === categoryFilter.value

    return matchesTerm && matchesStatus && matchesCategory
  })
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
function formatPrice(value: string | number): string {
  return currencyFormatter.format(Number(value))
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })
function formatDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
})
function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}

function coverImage(listing: ListingInterface): string | undefined {
  return listing.images[0]?.url
}

const selectedAd = ref<ListingInterface | null>(null)
const detailsVisible = ref(false)
const detailLoading = ref(false)

const showUpdatedAt = computed(
  () => !!selectedAd.value && selectedAd.value.updatedAt !== selectedAd.value.createdAt,
)

async function openDetails(listing: ListingInterface): Promise<void> {
  selectedAd.value = null
  detailsVisible.value = true
  detailLoading.value = true

  try {
    const { listing: fresh } = await listingStore.actFindOneListing(listing.id)
    selectedAd.value = fresh
  } catch {
    detailsVisible.value = false
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar anúncio',
      detail: 'Não foi possível carregar os detalhes do anúncio.',
      life: 3000,
    })
  } finally {
    detailLoading.value = false
  }
}

function confirmDelete(listing: ListingInterface, event?: Event): void {
  event?.stopPropagation()
  confirm.require({
    header: 'Excluir anúncio',
    message: `Tem certeza que deseja excluir "${listing.title}"? Esta ação não poderá ser desfeita.`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Excluir', severity: 'danger' },
    accept: () => deleteAd(listing),
  })
}

async function deleteAd(listing: ListingInterface): Promise<void> {
  try {
    await listingStore.actDeleteListing(listing.id)
    listings.value = listings.value.filter((item) => item.id !== listing.id)
    if (selectedAd.value?.id === listing.id) detailsVisible.value = false
    toast.add({
      severity: 'success',
      summary: 'Anúncio excluído',
      detail: `"${listing.title}" foi removido com sucesso.`,
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro ao excluir anúncio',
      detail: 'Não foi possível excluir o anúncio.',
      life: 3000,
    })
  }
}

async function fetchListings(): Promise<void> {
  loading.value = true
  try {
    const { listings: data } = await listingStore.actFindAllListings()
    listings.value = data
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar anúncios',
      detail: 'Não foi possível carregar a lista de anúncios.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

fetchListings()
</script>

<template>
  <section class="space-y-6">
    <header
      class="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100"
    >
      <h1 class="text-xl font-bold text-slate-900 tracking-tight">Anúncios</h1>
    </header>

    <ConfirmDialog />

    <div
      class="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        <IconField class="w-full">
          <InputIcon class="pi pi-search text-slate-400" />
          <InputText
            v-model="search"
            placeholder="Pesquise aqui"
            class="w-full rounded-xl bg-slate-50 border-none px-10 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200"
          />
        </IconField>

        <Select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Todos os status"
          show-clear
          class="w-full rounded-xl bg-slate-50 border-none shadow-none"
        />

        <Select
          v-model="categoryFilter"
          :options="categoryOptions"
          option-label="label"
          option-value="value"
          placeholder="Todas as categorias"
          show-clear
          class="w-full rounded-xl bg-slate-50 border-none shadow-none"
        />
      </div>

      <DataView
        :value="filteredListings"
        data-key="id"
        paginator
        :rows="9"
        layout="grid"
        :loading="loading"
      >
        <template #empty>
          <div class="py-12 text-center text-slate-500">
            {{ loading ? 'Carregando anúncios...' : 'Nenhum anúncio encontrado.' }}
          </div>
        </template>

        <template #grid="{ items }">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="ad in items as ListingInterface[]"
              :key="ad.id"
              role="button"
              tabindex="0"
              class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              @click="openDetails(ad)"
              @keydown.enter="openDetails(ad)"
              @keydown.space.prevent="openDetails(ad)"
            >
              <div class="relative h-48 overflow-hidden bg-slate-50 p-4">
                <img
                  v-if="coverImage(ad)"
                  :src="coverImage(ad)"
                  :alt="ad.title"
                  class="h-full w-full object-cover rounded-xl transition duration-300 group-hover:scale-105"
                />
                <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                  <i class="pi pi-image text-3xl" />
                </div>
              </div>

              <div class="flex flex-1 flex-col p-5">
                <h2
                  class="font-bold text-slate-900 text-lg tracking-tight line-clamp-1"
                  v-tooltip.top="{ value: ad.title, class: 'w-full!  max-w-lg' }"
                >
                  {{ ad.title }}
                </h2>

                <p
                  v-if="ad.description"
                  class="mt-1 line-clamp-1 text-sm text-slate-500"
                  v-tooltip.top="{ value: ad.description, class: 'w-full!  max-w-lg' }"
                >
                  {{ ad.description }}
                </p>

                <p
                  class="mt-1 line-clamp-1 font-semibold text-slate-700"
                  v-tooltip.top="formatPrice(ad.price)"
                >
                  {{ formatPrice(ad.price) }}
                </p>

                <p
                  v-if="ad.location"
                  class="mt-2 line-clamp-1 text-xs font-medium text-slate-500"
                  v-tooltip.top="{ value: ad.location, class: 'w-full! max-w-lg' }"
                >
                  <i class="pi pi-map-marker mr-1 text-[10px]" />{{ ad.location }}
                </p>

                <p
                  class="mt-1 line-clamp-1 text-xs font-medium text-slate-400"
                  v-tooltip.top="`Publicado em ${formatDate(ad.createdAt)}`"
                >
                  <i class="pi pi-calendar mr-1 text-[10px]" />{{ formatDate(ad.createdAt) }}
                </p>

                <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div class="flex min-w-0 flex-col gap-0.5">
                    <span
                      class="line-clamp-1 text-xs font-bold text-slate-700"
                      v-tooltip.top="ad.seller.name"
                    >
                      {{ ad.seller.name }}
                    </span>
                    <span
                      class="line-clamp-1 text-[10px] uppercase font-bold text-slate-400"
                      v-tooltip.top="ad.category.name"
                    >
                      {{ ad.category.name }}
                    </span>
                  </div>
                  <div class="flex shrink-0 items-center gap-2">
                    <span class="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <i class="pi pi-eye text-[10px]" /> {{ ad.viewsCount }}
                    </span>
                    <i class="pi pi-external-link text-slate-400 ml-2" />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </template>
      </DataView>
    </div>

    <Dialog v-model:visible="detailsVisible" modal dismissable-mask class="w-full max-w-2xl">
      <template #header>
        <span
          v-if="selectedAd"
          class="block max-w-[90%] truncate text-lg font-semibold text-slate-900"
          v-tooltip.bottom="selectedAd.title"
        >
          {{ selectedAd.title }}
        </span>
        <span v-else class="text-lg font-semibold text-slate-400">Carregando...</span>
      </template>

      <div v-if="detailLoading" class="flex items-center justify-center gap-2 py-16 text-slate-500">
        <i class="pi pi-spin pi-spinner text-2xl" />
        <span>Carregando detalhes...</span>
      </div>

      <div v-else-if="selectedAd" class="flex flex-col gap-4">
        <Carousel
          v-if="selectedAd.images.length"
          :value="selectedAd.images"
          :num-visible="1"
          :num-scroll="1"
          :circular="selectedAd.images.length > 1"
          :show-navigators="selectedAd.images.length > 1"
        >
          <template #item="{ data }">
            <div class="overflow-hidden rounded-xl bg-slate-100">
              <img :src="data.url" :alt="selectedAd.title" class="max-h-72 w-full object-contain" />
            </div>
          </template>
        </Carousel>
        <div
          v-else
          class="flex h-48 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-300"
        >
          <i class="pi pi-image text-5xl" />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Tag
            :value="statusMeta(selectedAd.status).label"
            :severity="statusMeta(selectedAd.status).severity"
          />
          <Tag :value="selectedAd.category.name" severity="info" />
          <Tag :value="typeLabel(selectedAd.type)" severity="secondary" />
          <Tag :value="conditionLabel(selectedAd.condition)" severity="secondary" />
        </div>

        <p class="text-2xl font-semibold text-slate-900">{{ formatPrice(selectedAd.price) }}</p>

        <p v-if="selectedAd.description" class="text-slate-600">{{ selectedAd.description }}</p>
        <p v-else class="text-slate-400 italic">Sem descrição.</p>

        <Divider />

        <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-slate-500">Código</dt>
            <dd class="font-medium text-slate-900 break-all">{{ selectedAd.id }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Visualizações</dt>
            <dd class="font-medium text-slate-900">{{ selectedAd.viewsCount }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Anunciante</dt>
            <dd class="font-medium text-slate-900">
              {{ selectedAd.seller.name }}
              <span class="block text-xs font-normal text-slate-500">
                {{ selectedAd.seller.email }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-slate-500">Localização</dt>
            <dd class="font-medium text-slate-900">{{ selectedAd.location ?? 'Não informada' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Publicado em</dt>
            <dd class="font-medium text-slate-900">{{ formatDateTime(selectedAd.createdAt) }}</dd>
          </div>
          <div v-if="showUpdatedAt">
            <dt class="text-slate-500">Última atualização</dt>
            <dd class="font-medium text-slate-900">{{ formatDateTime(selectedAd.updatedAt) }}</dd>
          </div>
        </dl>
      </div>

      <template #footer>
        <Button label="Fechar" severity="secondary" outlined @click="detailsVisible = false" />
        <Button
          v-if="selectedAd"
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          @click="confirmDelete(selectedAd)"
        />
      </template>
    </Dialog>
  </section>
</template>
