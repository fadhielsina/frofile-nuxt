<script setup lang="ts">
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
]

const { public: { siteName } } = useRuntimeConfig()
const open = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
    <Container class="flex h-16 items-center justify-between">
      <NuxtLink to="/" class="font-semibold tracking-tight">{{ siteName }}</NuxtLink>

      <nav class="hidden items-center gap-6 md:flex">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {{ link.label }}
        </a>
      </nav>

      <Button as-child size="sm" class="hidden md:inline-flex">
        <a href="#contact">Get in touch</a>
      </Button>

      <button
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <span class="i-block text-lg">{{ open ? '✕' : '☰' }}</span>
      </button>
    </Container>

    <div v-if="open" class="border-t md:hidden">
      <Container class="flex flex-col gap-1 py-3">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          @click="open = false"
        >
          {{ link.label }}
        </a>
      </Container>
    </div>
  </header>
</template>
