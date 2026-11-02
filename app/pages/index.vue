<script setup lang="ts">
const { data: profileData } = await useFetch<Profile | null>('/api/profile', { key: 'profile' })
const { data: skills } = await useFetch<Skill[]>('/api/skills')
const { data: experiences } = await useFetch<Experience[]>('/api/experiences')
const { data: education } = await useFetch<Education[]>('/api/education')
const { data: projects } = await useFetch<Project[]>('/api/projects')

const profile = computed(() => profileData.value ?? null)

const faq = computed(() =>
  profile.value ? buildFaq(profile.value, skills.value || [], experiences.value || [], education.value || []) : []
)

if (profile.value) {
  useProfileSeo(profile.value, skills.value || [], experiences.value || [], education.value || [], faq.value)
}

const stats = computed(() => [
  { value: '6+', label: 'Years experience' },
  { value: String(new Set((experiences.value || []).map((e) => e.company)).size), label: 'Companies' },
  { value: String((skills.value || []).length), label: 'Technologies' }
])

// highlighted tech chips floating around the portrait
const chips = computed(() => {
  const preferred = ['Laravel', 'Vue.js', 'MySQL']
  const names = (skills.value || []).map((s) => s.name)
  const hit = preferred.filter((p) => names.includes(p))
  return hit.length ? hit : names.slice(0, 3)
})
</script>

<template>
  <div>
    <HeroSection :profile="profile" :stats="stats" :chips="chips" />
    <SkillsSection :skills="skills || []" />
    <ExperienceSection :experiences="experiences || []" />
    <EducationSection :education="education || []" />
    <ProjectsSection :projects="projects || []" />
    <FaqSection :items="faq" />
    <ContactSection :profile="profile" />
  </div>
</template>
