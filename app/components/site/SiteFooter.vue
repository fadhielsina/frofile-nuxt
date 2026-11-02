<script setup lang="ts">
defineProps<{ name?: string }>()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/5 py-8">
    <Container class="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
      <p>© {{ year }} {{ name || 'Portfolio' }}. All rights reserved.</p>
      <NuxtLink to="/admin/login" class="transition-colors hover:text-foreground" rel="nofollow">Admin</NuxtLink>
    </Container>
  </footer>
</template>
