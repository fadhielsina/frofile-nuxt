<script setup lang="ts">
defineProps<{ projects: Project[] }>()
</script>

<template>
  <!-- hidden entirely until at least one project exists -->
  <section v-if="projects.length" id="projects" aria-labelledby="projects-title" class="py-20 sm:py-28">
    <Container>
      <SectionHeading id="projects-title" eyebrow="Projects" title="Things I've built" />

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FadeIn v-for="(project, i) in projects" :key="project.id" :delay="i * 0.06">
          <ProjectCard :project="project" />
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
