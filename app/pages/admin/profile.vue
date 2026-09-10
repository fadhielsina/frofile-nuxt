<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data } = await useFetch<Profile | null>('/api/profile')

const form = reactive({
  name: data.value?.name || '',
  headline: data.value?.headline || '',
  bio: data.value?.bio || '',
  avatarUrl: data.value?.avatarUrl || '',
  resumeUrl: data.value?.resumeUrl || '',
  email: data.value?.email || '',
  phone: data.value?.phone || '',
  location: data.value?.location || '',
  github: data.value?.socials?.github || '',
  linkedin: data.value?.socials?.linkedin || '',
  twitter: data.value?.socials?.twitter || ''
})

const saving = ref(false)

async function onSubmit() {
  saving.value = true
  try {
    await $fetch('/api/admin/profile', {
      method: 'PUT',
      body: {
        name: form.name,
        headline: form.headline,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        resumeUrl: form.resumeUrl,
        email: form.email,
        phone: form.phone,
        location: form.location,
        socials: { github: form.github, linkedin: form.linkedin, twitter: form.twitter }
      }
    })
    toast.success('Profile saved.')
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not save profile.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <AdminPageHeader title="Profile" description="This information powers the hero and contact sections." />

    <Card>
      <CardContent class="pt-6">
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
          <div class="grid gap-1.5">
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" />
          </div>
          <div class="grid gap-1.5">
            <Label for="headline">Headline</Label>
            <Input id="headline" v-model="form.headline" placeholder="Full-Stack Developer" />
          </div>
          <div class="grid gap-1.5 sm:col-span-2">
            <Label for="bio">Bio</Label>
            <Textarea id="bio" v-model="form.bio" rows="4" />
          </div>
          <div class="grid gap-1.5">
            <Label for="email">Email</Label>
            <Input id="email" v-model="form.email" type="email" />
          </div>
          <div class="grid gap-1.5">
            <Label for="phone">Phone</Label>
            <Input id="phone" v-model="form.phone" />
          </div>
          <div class="grid gap-1.5">
            <Label for="location">Location</Label>
            <Input id="location" v-model="form.location" />
          </div>
          <div class="grid gap-1.5">
            <Label for="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" v-model="form.avatarUrl" placeholder="https://..." />
          </div>
          <div class="grid gap-1.5">
            <Label for="resumeUrl">Résumé URL</Label>
            <Input id="resumeUrl" v-model="form.resumeUrl" placeholder="https://..." />
          </div>
          <div class="grid gap-1.5">
            <Label for="github">GitHub URL</Label>
            <Input id="github" v-model="form.github" placeholder="https://github.com/..." />
          </div>
          <div class="grid gap-1.5">
            <Label for="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" v-model="form.linkedin" placeholder="https://linkedin.com/in/..." />
          </div>
          <div class="grid gap-1.5">
            <Label for="twitter">X / Twitter URL</Label>
            <Input id="twitter" v-model="form.twitter" placeholder="https://x.com/..." />
          </div>

          <Button type="submit" class="sm:col-span-2" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save profile' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
