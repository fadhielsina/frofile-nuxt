<script setup lang="ts">
defineProps<{ projects: Project[] }>()
</script>

<template>
  <section id="projects" class="bg-muted/30 py-16 sm:py-24">
    <Container>
      <SectionHeading eyebrow="Projects" title="Things I've built" />

      <div v-if="!projects.length" class="text-muted-foreground">No projects added yet.</div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FadeIn v-for="(project, i) in projects" :key="project.id" :delay="i * 0.06">
          <ProjectCard :project="project" />
        </FadeIn>
      </div>
    </Container>
  </section>
</template>
