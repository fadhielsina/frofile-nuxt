<script setup lang="ts">
defineProps<{ experiences: Experience[] }>()

function range(exp: Experience) {
  return `${exp.startDate} — ${exp.isCurrent ? 'Present' : exp.endDate || ''}`
}
</script>

<template>
  <section id="experience" aria-labelledby="experience-title" class="relative py-20 sm:py-28">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    <Container>
      <SectionHeading id="experience-title" eyebrow="Experience" title="Where I've worked" description="Six-plus years building and maintaining web applications end to end." />

      <p v-if="!experiences.length" class="text-muted-foreground">No experience added yet.</p>

      <ol v-else class="relative space-y-6 border-l border-primary/25 pl-6 sm:pl-8">
        <li v-for="(exp, i) in experiences" :key="exp.id" class="relative">
          <span
            class="absolute -left-[31px] top-7 h-3 w-3 rounded-full bg-blue-400 ring-4 ring-background sm:-left-[39px]"
            :class="exp.isCurrent && 'shadow-[0_0_14px_3px_rgba(96,165,250,0.7)]'"
          />
          <FadeIn :delay="i * 0.06">
            <article class="glass glass-hover rounded-2xl p-5 sm:p-6">
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-lg font-semibold">{{ exp.role }} <span class="text-blue-300">· {{ exp.company }}</span></h3>
                <time class="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs text-blue-200">{{ range(exp) }}</time>
              </div>
              <p v-if="exp.location" class="mt-1 text-sm text-muted-foreground">{{ exp.location }}</p>
              <p v-if="exp.description" class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ exp.description }}</p>
            </article>
          </FadeIn>
        </li>
      </ol>
    </Container>
  </section>
</template>
