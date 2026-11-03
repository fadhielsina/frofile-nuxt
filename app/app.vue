<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en', class: 'dark' },
  titleTemplate: (title) => title || 'Portfolio',
  meta: [
    { name: 'theme-color', content: '#030712' },
    { name: 'color-scheme', content: 'dark' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
    { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon.png' },
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
  ]
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
