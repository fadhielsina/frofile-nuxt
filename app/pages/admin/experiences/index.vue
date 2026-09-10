<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from '@lucide/vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { items: experiences, pending, refresh, create, update, remove } = useCrud<Experience>('experiences')
await refresh()

const emptyForm = () => ({
  company: '',
  role: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '' as string | null,
  isCurrent: false,
  sortOrder: experiences.value.length
})

const dialogOpen = ref(false)
const editing = ref<Experience | null>(null)
const saving = ref(false)
const form = reactive(emptyForm())

const confirmOpen = ref(false)
const toDelete = ref<Experience | null>(null)
const deleting = ref(false)

function openCreate() {
  editing.value = null
  Object.assign(form, emptyForm())
  dialogOpen.value = true
}

function openEdit(exp: Experience) {
  editing.value = exp
  Object.assign(form, exp, { endDate: exp.endDate || '' })
  dialogOpen.value = true
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = { ...form, endDate: form.isCurrent ? null : form.endDate || null }
    if (editing.value) await update(editing.value.id, payload)
    else await create(payload)
    toast.success('Experience saved.')
    dialogOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not save experience.')
  } finally {
    saving.value = false
  }
}

function askDelete(exp: Experience) {
  toDelete.value = exp
  confirmOpen.value = true
}

async function onDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await remove(toDelete.value.id)
    toast.success('Experience deleted.')
    confirmOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not delete experience.')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AdminPageHeader title="Experience" description="Your work history timeline.">
      <template #actions>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add experience</Button>
      </template>
    </AdminPageHeader>

    <EmptyState v-if="!pending && !experiences.length" title="No experience yet">
      <template #action>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add experience</Button>
      </template>
    </EmptyState>

    <div v-else class="space-y-3">
      <Card v-for="exp in experiences" :key="exp.id">
        <CardContent class="flex items-center justify-between gap-4 pt-6">
          <div>
            <p class="font-medium">{{ exp.role }} · {{ exp.company }}</p>
            <p class="text-sm text-muted-foreground">
              {{ exp.startDate }} — {{ exp.isCurrent ? 'Present' : exp.endDate }}
            </p>
          </div>
          <div class="flex gap-1">
            <Button size="icon" variant="ghost" @click="openEdit(exp)"><Pencil class="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" @click="askDelete(exp)"><Trash2 class="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editing ? 'Edit experience' : 'Add experience' }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div class="grid gap-1.5">
            <Label for="company">Company</Label>
            <Input id="company" v-model="form.company" required />
          </div>
          <div class="grid gap-1.5">
            <Label for="role">Role</Label>
            <Input id="role" v-model="form.role" required />
          </div>
          <div class="grid gap-1.5">
            <Label for="location">Location</Label>
            <Input id="location" v-model="form.location" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <Label for="startDate">Start date</Label>
              <Input id="startDate" v-model="form.startDate" required placeholder="Jan 2022" />
            </div>
            <div class="grid gap-1.5">
              <Label for="endDate">End date</Label>
              <Input id="endDate" v-model="form.endDate" :disabled="form.isCurrent" placeholder="Dec 2023" />
            </div>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.isCurrent" type="checkbox" class="h-4 w-4 rounded border-input" />
            I currently work here
          </label>
          <div class="grid gap-1.5">
            <Label for="description">Description</Label>
            <Textarea id="description" v-model="form.description" rows="3" />
          </div>
          <div class="grid gap-1.5">
            <Label for="sortOrder">Sort order</Label>
            <Input id="sortOrder" v-model.number="form.sortOrder" type="number" />
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete experience?"
      :description="`This will remove '${toDelete?.role} at ${toDelete?.company}' permanently.`"
      :loading="deleting"
      @confirm="onDelete"
    />
  </div>
</template>
