<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink
} from '@lucide/vue'

const route = useRoute()
const { user, clear } = useUserSession()

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/experiences', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/messages', label: 'Messages', icon: Mail }
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/admin/login')
}
</script>

<template>
  <aside class="flex h-full w-64 shrink-0 flex-col border-r bg-card">
    <div class="border-b p-4">
      <p class="text-sm text-muted-foreground">Signed in as</p>
      <p class="truncate font-medium">{{ user?.name }}</p>
    </div>

    <nav class="flex-1 space-y-1 p-3">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors"
        :class="
          route.path === link.to
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        "
      >
        <component :is="link.icon" class="h-4 w-4" />
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="space-y-1 border-t p-3">
      <Button as-child variant="ghost" class="w-full justify-start gap-2.5">
        <NuxtLink to="/" target="_blank">
          <ExternalLink class="h-4 w-4" /> View site
        </NuxtLink>
      </Button>
      <Button variant="ghost" class="w-full justify-start gap-2.5" @click="logout">
        <LogOut class="h-4 w-4" /> Log out
      </Button>
    </div>
  </aside>
</template>
