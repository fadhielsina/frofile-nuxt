<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'

defineProps<{ profile: Profile | null }>()

const form = reactive({ name: '', email: '', subject: '', body: '' })
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  try {
    await $fetch('/api/messages', { method: 'POST', body: form })
    toast.success("Message sent — I'll get back to you soon.")
    form.name = ''
    form.email = ''
    form.subject = ''
    form.body = ''
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not send your message.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="contact" class="py-16 sm:py-24">
    <Container class="max-w-2xl">
      <SectionHeading
        eyebrow="Contact"
        title="Let's work together"
        :description="profile?.email ? `Or email me directly at ${profile.email}` : undefined"
      />

      <FadeIn>
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
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
          <Button type="submit" class="sm:col-span-2" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Send message' }}
          </Button>
        </form>
      </FadeIn>
    </Container>
  </section>
</template>
