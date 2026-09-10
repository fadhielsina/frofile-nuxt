<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8', props.class)">
    <slot />
  </div>
</template>
