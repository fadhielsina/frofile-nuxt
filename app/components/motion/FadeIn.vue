<script setup lang="ts">
/**
 * Reusable scroll-triggered fade/slide-up wrapper built on motion-v
 * (Framer Motion for Vue). Wrap any block of content with it instead of
 * hand-rolling whileInView animations at each call site.
 *
 * `motion` is imported explicitly (rather than relying on the motion-v Nuxt
 * module's auto-imports, which only registers the generic <Motion as="..">
 * component) so we can use the familiar dotted `<motion.div>` tag.
 */
import { motion } from 'motion-v'

withDefaults(
  defineProps<{
    delay?: number
    y?: number
    duration?: number
  }>(),
  {
    delay: 0,
    y: 24,
    duration: 0.5
  }
)
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :viewport="{ once: true, amount: 0 }"
    :transition="{ duration, delay, ease: 'easeOut' }"
  >
    <slot />
  </motion.div>
</template>
