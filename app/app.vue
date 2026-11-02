<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en', class: 'dark' },
  titleTemplate: (title) => title || 'Portfolio',
  meta: [
    { name: 'theme-color', content: '#030712' },
    { name: 'color-scheme', content: 'dark' }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }]
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>
