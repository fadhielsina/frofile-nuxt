<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wrench, Briefcase, GraduationCap, FolderKanban, Mail } from '@lucide/vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const [{ data: skills }, { data: experiences }, { data: education }, { data: projects }, { data: messages }] =
  await Promise.all([
    useFetch<Skill[]>('/api/skills'),
    useFetch<Experience[]>('/api/experiences'),
    useFetch<Education[]>('/api/education'),
    useFetch<Project[]>('/api/projects'),
    useFetch<ContactMessage[]>('/api/admin/messages')
  ])

const cards = computed(() => [
  { label: 'Skills', count: skills.value?.length || 0, icon: Wrench, to: '/admin/skills' },
  { label: 'Experience', count: experiences.value?.length || 0, icon: Briefcase, to: '/admin/experiences' },
  { label: 'Education', count: education.value?.length || 0, icon: GraduationCap, to: '/admin/education' },
  { label: 'Projects', count: projects.value?.length || 0, icon: FolderKanban, to: '/admin/projects' },
  {
    label: 'Unread messages',
    count: messages.value?.filter((m) => !m.read).length || 0,
    icon: Mail,
    to: '/admin/messages'
  }
])
</script>

<template>
  <div>
    <AdminPageHeader title="Dashboard" description="Overview of your profile content." />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="card in cards" :key="card.label" :to="card.to">
        <Card class="transition-shadow hover:shadow-md">
          <CardHeader class="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">{{ card.label }}</CardTitle>
            <component :is="card.icon" class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-bold">{{ card.count }}</p>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>
