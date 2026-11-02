<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, ArrowUpRight } from '@lucide/vue'
import { toast } from 'vue-sonner'

const props = defineProps<{ profile: Profile | null }>()

// The message form needs the database; while the site runs on hardcoded data
// (DATA_SOURCE=static) we show direct contact links instead.
const { public: { contactForm } } = useRuntimeConfig()

const form = reactive({ name: '', email: '', subject: '', body: '' })
const submitting = ref(false)

const whatsapp = computed(() => {
  const digits = (props.profile?.phone || '').replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return intl ? `https://wa.me/${intl}` : ''
})

async function onSubmit() {
  submitting.value = true
  try {
    await $fetch('/api/messages', { method: 'POST', body: form })
    toast.success("Message sent — I'll get back to you soon.")
    Object.assign(form, { name: '', email: '', subject: '', body: '' })
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not send your message.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="contact" aria-labelledby="contact-title" class="relative py-20 sm:py-28">
    <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-80 bg-gradient-to-t from-blue-700/15 to-transparent" />
    <Container class="max-w-3xl">
      <SectionHeading
        id="contact-title"
        eyebrow="Contact"
        title="Let's build something great"
        description="Have a project, role or idea in mind? Reach out — I usually reply within a day."
      />

      <FadeIn>
        <div v-if="!contactForm" class="grid gap-4 sm:grid-cols-2">
          <a
            v-if="profile?.email"
            :href="`mailto:${profile.email}`"
            class="glass glass-hover group flex items-center justify-between gap-4 rounded-2xl p-5"
          >
            <span class="flex items-center gap-3">
              <span class="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><Mail class="h-5 w-5" /></span>
              <span>
                <span class="block text-xs text-muted-foreground">Email</span>
                <span class="break-all text-sm font-medium">{{ profile.email }}</span>
              </span>
            </span>
            <ArrowUpRight class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </a>
          <a
            v-if="whatsapp"
            :href="whatsapp"
            target="_blank"
            rel="noopener"
            class="glass glass-hover group flex items-center justify-between gap-4 rounded-2xl p-5"
          >
            <span class="flex items-center gap-3">
              <span class="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><Phone class="h-5 w-5" /></span>
              <span>
                <span class="block text-xs text-muted-foreground">WhatsApp</span>
                <span class="text-sm font-medium">{{ profile?.phone }}</span>
              </span>
            </span>
            <ArrowUpRight class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </a>
          <p v-if="profile?.location" class="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
            <MapPin class="h-4 w-4" /> {{ profile.location }}
          </p>
        </div>

        <form v-else class="glass grid gap-4 rounded-2xl p-6 sm:grid-cols-2" @submit.prevent="onSubmit">
          <div class="grid gap-1.5">
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" required placeholder="Jane Doe" />
          </div>
          <div class="grid gap-1.5">
            <Label for="email">Email</Label>
            <Input id="email" v-model="form.email" type="email" required placeholder="jane@example.com" />
          </div>
          <div class="grid gap-1.5 sm:col-span-2">
            <Label for="subject">Subject</Label>
            <Input id="subject" v-model="form.subject" placeholder="Let's talk about..." />
          </div>
          <div class="grid gap-1.5 sm:col-span-2">
            <Label for="body">Message</Label>
            <Textarea id="body" v-model="form.body" required rows="5" placeholder="Your message" />
          </div>
          <Button type="submit" class="rounded-full sm:col-span-2" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Send message' }}
          </Button>
        </form>
      </FadeIn>
    </Container>
  </section>
</template>
