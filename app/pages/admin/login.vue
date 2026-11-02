<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Admin sign in', robots: 'noindex, nofollow' })

const { fetch: refreshSession, loggedIn } = useUserSession()

const { data: status, pending: statusPending } = await useFetch('/api/auth/status')
const isFirstRun = computed(() => status.value?.hasAdmin === false)

const form = reactive({ name: '', email: '', password: '' })
const submitting = ref(false)

if (loggedIn.value) await navigateTo('/admin')

async function onSubmit() {
  submitting.value = true
  try {
    if (isFirstRun.value) {
      await $fetch('/api/auth/setup', { method: 'POST', body: form })
    } else {
      await $fetch('/api/auth/login', { method: 'POST', body: { email: form.email, password: form.password } })
    }
    await refreshSession()
    toast.success('Welcome!')
    await navigateTo('/admin')
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Something went wrong.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Container class="flex min-h-[calc(100vh-4rem)] max-w-md items-center">
    <Card v-if="!statusPending" class="w-full">
      <CardHeader>
        <CardTitle>{{ isFirstRun ? 'Create your admin account' : 'Admin sign in' }}</CardTitle>
        <CardDescription>
          {{ isFirstRun ? 'This runs once — set up the single admin account for your CMS.' : 'Sign in to manage your profile content.' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div v-if="isFirstRun" class="grid gap-1.5">
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" required placeholder="Your name" />
          </div>
          <div class="grid gap-1.5">
            <Label for="email">Email</Label>
            <Input id="email" v-model="form.email" type="email" required placeholder="you@example.com" />
          </div>
          <div class="grid gap-1.5">
            <Label for="password">Password</Label>
            <Input id="password" v-model="form.password" type="password" required minlength="8" placeholder="••••••••" />
          </div>
          <Button type="submit" :disabled="submitting">
            {{ submitting ? 'Please wait…' : isFirstRun ? 'Create account' : 'Sign in' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </Container>
</template>
