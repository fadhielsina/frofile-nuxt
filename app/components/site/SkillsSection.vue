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
  <section id="skills" class="py-16 sm:py-24">
    <Container>
      <SectionHeading eyebrow="Skills" title="What I work with" />

      <div v-if="!skills.length" class="text-muted-foreground">No skills added yet.</div>

      <div v-else class="grid gap-8 sm:grid-cols-2">
        <FadeIn v-for="([category, list], i) in grouped" :key="category" :delay="i * 0.08">
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {{ category }}
          </h3>
          <ul class="space-y-3">
            <li v-for="skill in list" :key="skill.id">
              <div class="mb-1 flex items-center justify-between text-sm">
                <span class="font-medium">{{ skill.name }}</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  class="h-full rounded-full bg-primary transition-all"
                  :style="{ width: `${(skill.level / 5) * 100}%` }"
                />
              </div>
            </li>
          </ul>
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
