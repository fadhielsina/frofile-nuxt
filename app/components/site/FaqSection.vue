<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

defineProps<{ items: { q: string; a: string }[] }>()
</script>

<template>
  <section v-if="items.length" id="faq" aria-labelledby="faq-title" class="py-20 sm:py-28">
    <Container class="max-w-3xl">
      <SectionHeading
        id="faq-title"
        eyebrow="FAQ"
        title="Quick answers"
        description="Straight answers about who I am, what I work with and how to reach me."
      />

      <div class="space-y-3">
        <FadeIn v-for="(item, i) in items" :key="item.q" :delay="i * 0.04">
          <!-- native <details>: answers stay in the HTML for crawlers and AI engines -->
          <details class="glass group rounded-2xl open:border-primary/40">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
              <h3 class="text-base font-medium">{{ item.q }}</h3>
              <ChevronDown class="h-4 w-4 shrink-0 text-blue-300 transition-transform group-open:rotate-180" />
            </summary>
            <p class="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{{ item.a }}</p>
          </details>
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
