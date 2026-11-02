<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { motion } from 'motion-v'
import { ArrowRight, GitBranch, Link2, Mail, MapPin } from '@lucide/vue'

const props = defineProps<{
  profile: Profile | null
  stats?: { label: string; value: string }[]
  chips?: string[]
}>()

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
const socials = computed(() => Object.entries(props.profile?.socials || {}).filter(([, url]) => Boolean(url)))

const chipPositions = [
  'left-0 top-10 sm:-left-6',
  'right-0 top-24 sm:-right-8',
  'bottom-16 left-2 sm:-left-10'
]
</script>

<template>
  <section id="about" aria-labelledby="hero-title" class="relative isolate overflow-hidden">
    <!-- ambient blue glow + grid -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="grid-bg absolute inset-0" />
      <div class="absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[120px]" />
      <div class="absolute right-[-8rem] top-40 h-80 w-80 rounded-full bg-sky-500/15 blur-[100px]" />
    </div>

    <Container class="grid items-center gap-12 pb-56 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:pb-72">
      <div class="text-center lg:text-left">
        <motion.div
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-blue-200"
        >
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
          </span>
          <MapPin v-if="profile?.location" class="h-3.5 w-3.5" />
          {{ profile?.location || 'Open to opportunities' }}
        </motion.div>

        <motion.h1
          id="hero-title"
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 0.08 }"
          class="text-gradient text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          {{ profile?.name || 'Your Name' }}
        </motion.h1>

        <motion.p
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 0.18 }"
          class="mt-4 text-xl font-medium text-blue-300 sm:text-2xl"
        >
          {{ profile?.headline || 'Full-Stack Developer' }}
        </motion.p>

        <motion.p
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 0.28 }"
          class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0"
        >
          {{ profile?.bio }}
        </motion.p>

        <motion.div
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 0.38 }"
          class="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
        >
          <Button as-child size="lg" class="group rounded-full shadow-xl shadow-blue-600/30">
            <a href="#contact">
              Contact me
              <ArrowRight class="transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button as-child size="lg" variant="outline" class="rounded-full bg-card/40 backdrop-blur">
            <a href="#experience">View experience</a>
          </Button>
          <Button v-if="profile?.resumeUrl" as-child size="lg" variant="ghost" class="rounded-full">
            <a :href="profile.resumeUrl" target="_blank" rel="noopener">Résumé</a>
          </Button>
        </motion.div>

        <motion.div
          v-if="socials.length || profile?.email"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.7, delay: 0.5 }"
          class="mt-8 flex items-center justify-center gap-3 lg:justify-start"
        >
          <a
            v-for="[key, url] in socials"
            :key="key"
            :href="url"
            target="_blank"
            rel="noopener me"
            class="grid h-10 w-10 place-items-center rounded-full border bg-card/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            :aria-label="`${profile?.name} on ${key}`"
          >
            <component :is="socialIcons[key] || Link2" class="h-4 w-4" />
          </a>
          <a
            v-if="profile?.email"
            :href="`mailto:${profile.email}`"
            class="grid h-10 w-10 place-items-center rounded-full border bg-card/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            aria-label="Send email"
          >
            <Mail class="h-4 w-4" />
          </a>
        </motion.div>

        <dl v-if="stats?.length" class="mt-10 grid max-w-md grid-cols-3 gap-4 text-center lg:text-left">
          <div v-for="s in stats" :key="s.label">
            <dd class="text-2xl font-bold text-foreground sm:text-3xl">{{ s.value }}</dd>
            <dt class="text-xs text-muted-foreground">{{ s.label }}</dt>
          </div>
        </dl>
      </div>

      <!-- portrait -->
      <motion.div
        :initial="{ opacity: 0, scale: 0.92 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.8, delay: 0.2 }"
        class="relative mx-auto w-full max-w-xs sm:max-w-sm"
      >
        <div class="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-blue-600/40 via-sky-400/20 to-transparent blur-2xl" />
        <div class="relative rounded-[2rem] bg-gradient-to-br from-blue-400/70 via-blue-600/20 to-transparent p-[2px]">
          <div class="overflow-hidden rounded-[calc(2rem-2px)] bg-card">
            <img
              v-if="profile?.avatarUrl"
              :src="profile.avatarUrl"
              :alt="`Portrait of ${profile?.name}`"
              width="480"
              height="480"
              fetchpriority="high"
              class="aspect-square w-full object-cover"
            />
            <div v-else class="grid aspect-square w-full place-items-center text-6xl font-bold text-primary">{{ initials }}</div>
          </div>
        </div>

        <span
          v-for="(chip, i) in (chips || []).slice(0, 3)"
          :key="chip"
          class="absolute animate-float rounded-full border border-primary/30 bg-background/80 px-3 py-1.5 text-xs font-medium text-blue-200 shadow-lg shadow-blue-900/40 backdrop-blur"
          :class="chipPositions[i]"
          :style="{ animationDelay: `${i * 0.8}s` }"
        >
          {{ chip }}
        </span>
      </motion.div>
    </Container>

    <!-- swarm: particles assemble into the word, scatter on pointer / click -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-52 sm:h-64 lg:h-72 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
      <ClientOnly>
        <SwarmText text="FULLSTACK" />
      </ClientOnly>
    </div>
  </section>
</template>
