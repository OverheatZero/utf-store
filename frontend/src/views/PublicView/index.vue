<script setup lang="ts">
defineOptions({ name: 'PublicViewLayout' })
</script>

<template>
  <main
    class="flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 py-12 sm:px-6 lg:px-8"
  >
    <slot />
    <router-view />
  </main>
</template>
