<script setup lang="ts">
const props = defineProps<{ experiences: Experience[] }>()

function range(exp: Experience) {
  return `${exp.startDate} — ${exp.isCurrent ? 'Present' : exp.endDate || ''}`
}
</script>

<template>
  <section id="experience" class="bg-muted/30 py-16 sm:py-24">
    <Container>
      <SectionHeading eyebrow="Experience" title="Where I've worked" />

      <div v-if="!experiences.length" class="text-muted-foreground">No experience added yet.</div>

      <ol v-else class="relative space-y-10 border-l pl-6">
        <li v-for="(exp, i) in experiences" :key="exp.id" class="relative">
          <FadeIn :delay="i * 0.08">
            <span class="absolute -left-[31px] mt-1.5 h-3 w-3 rounded-full bg-primary" />
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 class="font-semibold">{{ exp.role }} · {{ exp.company }}</h3>
              <span class="text-sm text-muted-foreground">{{ range(exp) }}</span>
            </div>
            <p v-if="exp.location" class="text-sm text-muted-foreground">{{ exp.location }}</p>
            <p v-if="exp.description" class="mt-2 text-sm text-muted-foreground">{{ exp.description }}</p>
          </FadeIn>
        </li>
      </ol>
    </Container>
  </section>
</template>
