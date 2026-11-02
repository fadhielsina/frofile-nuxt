<script setup lang="ts">
const props = defineProps<{ skills: Skill[] }>()

const grouped = computed(() => {
  const map = new Map<string, Skill[]>()
  for (const skill of props.skills) {
    const list = map.get(skill.category) || []
    list.push(skill)
    map.set(skill.category, list)
  }
  return Array.from(map.entries())
})
</script>

<template>
  <section id="skills" aria-labelledby="skills-title" class="py-20 sm:py-28">
    <Container>
      <SectionHeading id="skills-title" eyebrow="Skills" title="Tech stack I build with" description="Tools and technologies I use day to day to ship fullstack products." />

      <p v-if="!skills.length" class="text-muted-foreground">No skills added yet.</p>

      <div v-else class="grid gap-5 sm:grid-cols-2">
        <FadeIn v-for="([category, list], i) in grouped" :key="category" :delay="i * 0.08">
          <article class="glass glass-hover h-full rounded-2xl p-6">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-300">{{ category }}</h3>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="skill in list"
                :key="skill.id"
                class="group relative overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/60 hover:bg-primary/15"
              >
                {{ skill.name }}
                <span class="ml-2 inline-flex gap-0.5 align-middle" :aria-label="`Level ${skill.level} of 5`">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="h-1 w-1 rounded-full"
                    :class="n <= skill.level ? 'bg-blue-400' : 'bg-white/15'"
                  />
                </span>
              </li>
            </ul>
          </article>
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
