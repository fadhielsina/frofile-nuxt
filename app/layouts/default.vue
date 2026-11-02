<script setup lang="ts">
const { data: profile } = await useFetch<Profile | null>('/api/profile', { key: 'profile' })
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
    >
      Skip to content
    </a>
    <SiteHeader :name="profile?.name" />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <SiteFooter :name="profile?.name" />
  </div>
</template>
