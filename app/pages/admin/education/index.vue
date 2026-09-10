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

const { items: education, pending, refresh, create, update, remove } = useCrud<Education>('education')
await refresh()

const emptyForm = () => ({
  school: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '' as string | null,
  description: '',
  sortOrder: education.value.length
})

const dialogOpen = ref(false)
const editing = ref<Education | null>(null)
const saving = ref(false)
const form = reactive(emptyForm())

const confirmOpen = ref(false)
const toDelete = ref<Education | null>(null)
const deleting = ref(false)

function openCreate() {
  editing.value = null
  Object.assign(form, emptyForm())
  dialogOpen.value = true
}

function openEdit(edu: Education) {
  editing.value = edu
  Object.assign(form, edu, { endDate: edu.endDate || '' })
  dialogOpen.value = true
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = { ...form, endDate: form.endDate || null }
    if (editing.value) await update(editing.value.id, payload)
    else await create(payload)
    toast.success('Education saved.')
    dialogOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not save education.')
  } finally {
    saving.value = false
  }
}

function askDelete(edu: Education) {
  toDelete.value = edu
  confirmOpen.value = true
}

async function onDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await remove(toDelete.value.id)
    toast.success('Education deleted.')
    confirmOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not delete education.')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AdminPageHeader title="Education" description="Your academic background.">
      <template #actions>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add education</Button>
      </template>
    </AdminPageHeader>

    <EmptyState v-if="!pending && !education.length" title="No education yet">
      <template #action>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add education</Button>
      </template>
    </EmptyState>

    <div v-else class="space-y-3">
      <Card v-for="edu in education" :key="edu.id">
        <CardContent class="flex items-center justify-between gap-4 pt-6">
          <div>
            <p class="font-medium">{{ edu.degree }} <span v-if="edu.field">· {{ edu.field }}</span></p>
            <p class="text-sm text-muted-foreground">{{ edu.school }} · {{ edu.startDate }} — {{ edu.endDate || 'Present' }}</p>
          </div>
          <div class="flex gap-1">
            <Button size="icon" variant="ghost" @click="openEdit(edu)"><Pencil class="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" @click="askDelete(edu)"><Trash2 class="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editing ? 'Edit education' : 'Add education' }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div class="grid gap-1.5">
            <Label for="school">School</Label>
            <Input id="school" v-model="form.school" required />
          </div>
          <div class="grid gap-1.5">
            <Label for="degree">Degree</Label>
            <Input id="degree" v-model="form.degree" placeholder="B.Sc." />
          </div>
          <div class="grid gap-1.5">
            <Label for="field">Field of study</Label>
            <Input id="field" v-model="form.field" placeholder="Computer Science" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <Label for="startDate">Start date</Label>
              <Input id="startDate" v-model="form.startDate" required placeholder="2018" />
            </div>
            <div class="grid gap-1.5">
              <Label for="endDate">End date</Label>
              <Input id="endDate" v-model="form.endDate" placeholder="2022" />
            </div>
          </div>
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
      title="Delete education?"
      :description="`This will remove '${toDelete?.school}' permanently.`"
      :loading="deleting"
      @confirm="onDelete"
    />
  </div>
</template>
