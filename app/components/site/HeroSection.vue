<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GitBranch, Link2, Mail } from '@lucide/vue'

const props = defineProps<{ profile: Profile | null }>()

const initials = computed(() =>
  (props.profile?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

// lucide's brand/logo icons (GitHub, LinkedIn, X) were removed upstream —
// generic icons stand in for them here.
const socialIcons: Record<string, any> = { github: GitBranch, linkedin: Link2, twitter: Link2 }
const socials = computed(() =>
  Object.entries(props.profile?.socials || {}).filter(([, url]) => Boolean(url))
)
</script>

<template>
  <section id="about" class="relative overflow-hidden py-20 sm:py-28">
    <Container class="flex flex-col items-center gap-8 text-center">
      <FadeIn>
        <Avatar class="h-28 w-28 border shadow-sm">
          <AvatarImage v-if="profile?.avatarUrl" :src="profile.avatarUrl" :alt="profile?.name" />
          <AvatarFallback class="text-2xl">{{ initials }}</AvatarFallback>
        </Avatar>
      </FadeIn>

      <FadeIn :delay="0.1">
        <h1 class="text-3xl font-bold tracking-tight sm:text-5xl">
          {{ profile?.name || 'Your Name' }}
        </h1>
        <p class="mt-3 text-lg text-muted-foreground sm:text-xl">
          {{ profile?.headline || 'Full-Stack Developer' }}
        </p>
      </FadeIn>

      <FadeIn :delay="0.2" class="max-w-xl">
        <p class="text-muted-foreground">{{ profile?.bio }}</p>
      </FadeIn>

      <FadeIn :delay="0.3" class="flex flex-wrap items-center justify-center gap-3">
        <Button as-child>
          <a href="#contact">Contact me</a>
        </Button>
        <Button v-if="profile?.resumeUrl" as-child variant="outline">
          <a :href="profile.resumeUrl" target="_blank" rel="noopener">Download résumé</a>
        </Button>
      </FadeIn>

      <FadeIn v-if="socials.length || profile?.email" :delay="0.4" class="flex items-center gap-4">
        <a
          v-for="[key, url] in socials"
          :key="key"
          :href="url"
          target="_blank"
          rel="noopener"
          class="text-muted-foreground transition-colors hover:text-foreground"
          :aria-label="key"
        >
          <component :is="socialIcons[key] || Mail" class="h-5 w-5" />
        </a>
        <a
          v-if="profile?.email"
          :href="`mailto:${profile.email}`"
          class="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="email"
        >
          <Mail class="h-5 w-5" />
        </a>
      </FadeIn>
    </Container>
  </section>
</template>
