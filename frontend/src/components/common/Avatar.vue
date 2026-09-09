<script setup lang="ts">
defineOptions({ name: 'CompAvatar' })

const props = defineProps<{
  username?: string
  srcImg?: string
}>()

function getInitials(): string {
  if (!props.username) return 'US'

  return props.username
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
</script>

<template>
  <div class="max-w-12 max-h-12" v-bind="$attrs">
    <img v-if="srcImg" :src="srcImg" :alt="`img-${username}`" :class="$attrs?.class" />
    <div
      v-else
      class="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-700"
    >
      {{ getInitials() }}
    </div>
  </div>
</template>
