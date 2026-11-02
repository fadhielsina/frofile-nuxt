<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  id?: string
}>()
</script>

<template>
  <div class="mb-12 max-w-2xl">
    <p v-if="eyebrow" class="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
      <span class="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
      {{ eyebrow }}
    </p>
    <h2 :id="id" class="text-gradient text-3xl font-bold tracking-tight sm:text-4xl">{{ title }}</h2>
    <p v-if="description" class="mt-4 text-muted-foreground">{{ description }}</p>
  </div>
</template>
