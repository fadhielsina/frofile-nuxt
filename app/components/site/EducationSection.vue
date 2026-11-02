<script setup lang="ts">
defineProps<{ education: Education[] }>()
</script>

<template>
  <section v-if="education.length" id="education" aria-labelledby="education-title" class="py-20 sm:py-28">
    <Container>
      <SectionHeading id="education-title" eyebrow="Education" title="Academic background & training" />

      <div class="grid gap-5 md:grid-cols-3">
        <FadeIn v-for="(edu, i) in education" :key="edu.id" :delay="i * 0.08">
          <article class="glass glass-hover h-full rounded-2xl p-6">
            <time class="text-xs font-medium uppercase tracking-wider text-blue-300">
              {{ edu.startDate }}{{ edu.endDate && edu.endDate !== edu.startDate ? ` — ${edu.endDate}` : '' }}
            </time>
            <h3 class="mt-3 font-semibold">{{ edu.school }}</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ [edu.degree, edu.field].filter(Boolean).join(' · ') }}
            </p>
            <p v-if="edu.description" class="mt-2 text-sm text-muted-foreground">{{ edu.description }}</p>
          </article>
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
