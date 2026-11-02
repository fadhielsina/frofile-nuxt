<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Menu, X } from '@lucide/vue'

defineProps<{ name?: string }>()

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' }
]

const open = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
    <Container class="flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight" aria-label="Home">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
          {{ (name || 'F').charAt(0) }}
        </span>
        <span class="hidden sm:inline">{{ name || 'Portfolio' }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
        >
          {{ link.label }}
        </a>
      </nav>

      <Button as-child size="sm" class="hidden rounded-full shadow-lg shadow-blue-600/30 md:inline-flex">
        <a href="#contact">Get in touch</a>
      </Button>

      <button
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card/60 md:hidden"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        :aria-expanded="open"
        @click="open = !open"
      >
        <component :is="open ? X : Menu" class="h-4 w-4" />
      </button>
    </Container>

    <div v-if="open" class="border-t border-white/5 md:hidden">
      <Container class="flex flex-col gap-1 py-3">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          @click="open = false"
        >
          {{ link.label }}
        </a>
      </Container>
    </div>
  </header>
</template>
