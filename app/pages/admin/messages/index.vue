<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Mail, MailOpen } from '@lucide/vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { items: messages, pending, refresh, patch, remove } = useCrud<ContactMessage>('messages', {
  listPath: '/api/admin/messages'
})
await refresh()

const confirmOpen = ref(false)
const toDelete = ref<ContactMessage | null>(null)
const deleting = ref(false)

async function toggleRead(message: ContactMessage) {
  try {
    await patch(message.id, { read: !message.read })
  } catch {
    toast.error('Could not update message.')
  }
}

function askDelete(message: ContactMessage) {
  toDelete.value = message
  confirmOpen.value = true
}

async function onDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await remove(toDelete.value.id)
    toast.success('Message deleted.')
    confirmOpen.value = false
  } catch {
    toast.error('Could not delete message.')
  } finally {
    deleting.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}
</script>

<template>
  <div>
    <AdminPageHeader title="Messages" description="Submissions from your contact form." />

    <EmptyState v-if="!pending && !messages.length" title="No messages yet" description="Submissions from your contact form will show up here." />

    <div v-else class="space-y-3">
      <Card v-for="message in messages" :key="message.id" :class="!message.read && 'border-primary/50'">
        <CardContent class="pt-6">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p class="flex items-center gap-2 font-medium">
                {{ message.subject || '(no subject)' }}
                <Badge v-if="!message.read" variant="default">New</Badge>
              </p>
              <p class="text-sm text-muted-foreground">
                {{ message.name }} · {{ message.email }} · {{ formatDate(message.createdAt) }}
              </p>
            </div>
            <div class="flex gap-1">
              <Button size="icon" variant="ghost" :title="message.read ? 'Mark unread' : 'Mark read'" @click="toggleRead(message)">
                <component :is="message.read ? Mail : MailOpen" class="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" @click="askDelete(message)"><Trash2 class="h-4 w-4" /></Button>
            </div>
          </div>
          <p class="mt-3 whitespace-pre-wrap text-sm">{{ message.body }}</p>
        </CardContent>
      </Card>
    </div>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete message?"
      description="This message will be permanently deleted."
      :loading="deleting"
      @confirm="onDelete"
    />
  </div>
</template>
