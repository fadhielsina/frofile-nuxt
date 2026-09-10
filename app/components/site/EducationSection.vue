<script setup lang="ts">
const props = defineProps<{ education: Education[] }>()

function range(edu: Education) {
  return `${edu.startDate} — ${edu.endDate || 'Present'}`
}
</script>

<template>
  <section v-if="education.length" id="education" class="py-16 sm:py-24">
    <Container>
      <SectionHeading eyebrow="Education" title="Academic background" />

      <div class="space-y-8">
        <FadeIn v-for="(edu, i) in education" :key="edu.id" :delay="i * 0.08">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 class="font-semibold">{{ edu.degree }}<span v-if="edu.field"> · {{ edu.field }}</span></h3>
            <span class="text-sm text-muted-foreground">{{ range(edu) }}</span>
          </div>
          <p class="text-sm text-muted-foreground">{{ edu.school }}</p>
          <p v-if="edu.description" class="mt-2 text-sm text-muted-foreground">{{ edu.description }}</p>
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
