<script setup lang="ts">
const { public: { siteName } } = useRuntimeConfig()

useHead({
  titleTemplate: (title) => (title ? `${title} · ${siteName}` : siteName)
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Sonner />
  </div>
</template>
