<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-10 max-w-2xl">
    <p v-if="eyebrow" class="mb-2 text-sm font-semibold uppercase tracking-wider text-primary/70">
      {{ eyebrow }}
    </p>
    <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ title }}</h2>
    <p v-if="description" class="mt-3 text-muted-foreground">{{ description }}</p>
  </div>
</template>
