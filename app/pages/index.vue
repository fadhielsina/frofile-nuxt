<script setup lang="ts">
const { data: profile } = await useFetch<Profile | null>('/api/profile')
const { data: skills } = await useFetch<Skill[]>('/api/skills')
const { data: experiences } = await useFetch<Experience[]>('/api/experiences')
const { data: education } = await useFetch<Education[]>('/api/education')
const { data: projects } = await useFetch<Project[]>('/api/projects')

useSeoMeta({
  title: () => profile.value?.name || 'Profile',
  description: () => profile.value?.headline || profile.value?.bio || undefined
})
</script>

<template>
  <div>
    <HeroSection :profile="profile ?? null" />
    <SkillsSection :skills="skills || []" />
    <ExperienceSection :experiences="experiences || []" />
    <EducationSection :education="education || []" />
    <ProjectsSection :projects="projects || []" />
    <ContactSection :profile="profile ?? null" />
  </div>
</template>
