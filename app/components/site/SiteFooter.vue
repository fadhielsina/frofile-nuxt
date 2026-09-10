<script setup lang="ts">
const { public: { siteName } } = useRuntimeConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t py-8">
    <Container class="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
      <p>© {{ year }} {{ siteName }}. All rights reserved.</p>
      <NuxtLink to="/admin/login" class="hover:text-foreground">Admin</NuxtLink>
    </Container>
  </footer>
</template>
