<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from '@lucide/vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { items: skills, pending, refresh, create, update, remove } = useCrud<Skill>('skills')
await refresh()

const dialogOpen = ref(false)
const editing = ref<Skill | null>(null)
const saving = ref(false)
const form = reactive({ name: '', category: '', level: 3, sortOrder: 0 })

const confirmOpen = ref(false)
const toDelete = ref<Skill | null>(null)
const deleting = ref(false)

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', category: '', level: 3, sortOrder: skills.value.length })
  dialogOpen.value = true
}

function openEdit(skill: Skill) {
  editing.value = skill
  Object.assign(form, skill)
  dialogOpen.value = true
}

async function onSubmit() {
  saving.value = true
  try {
    if (editing.value) await update(editing.value.id, form)
    else await create(form)
    toast.success('Skill saved.')
    dialogOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not save skill.')
  } finally {
    saving.value = false
  }
}

function askDelete(skill: Skill) {
  toDelete.value = skill
  confirmOpen.value = true
}

async function onDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await remove(toDelete.value.id)
    toast.success('Skill deleted.')
    confirmOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not delete skill.')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AdminPageHeader title="Skills" description="Shown grouped by category on the public site.">
      <template #actions>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add skill</Button>
      </template>
    </AdminPageHeader>

    <EmptyState v-if="!pending && !skills.length" title="No skills yet" description="Add your first skill to get started.">
      <template #action>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add skill</Button>
      </template>
    </EmptyState>

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <Card v-for="skill in skills" :key="skill.id">
        <CardContent class="flex items-center justify-between gap-4 pt-6">
          <div>
            <p class="font-medium">{{ skill.name }}</p>
            <div class="mt-1 flex items-center gap-2">
              <Badge variant="secondary">{{ skill.category }}</Badge>
              <span class="text-xs text-muted-foreground">Level {{ skill.level }}/5</span>
            </div>
          </div>
          <div class="flex gap-1">
            <Button size="icon" variant="ghost" @click="openEdit(skill)"><Pencil class="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" @click="askDelete(skill)"><Trash2 class="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="dialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editing ? 'Edit skill' : 'Add skill' }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div class="grid gap-1.5">
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" required placeholder="TypeScript" />
          </div>
          <div class="grid gap-1.5">
            <Label for="category">Category</Label>
            <Input id="category" v-model="form.category" required placeholder="Language" />
          </div>
          <div class="grid gap-1.5">
            <Label for="level">Level (1–5)</Label>
            <Input id="level" v-model.number="form.level" type="number" min="1" max="5" required />
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
      title="Delete skill?"
      :description="`This will remove '${toDelete?.name}' permanently.`"
      :loading="deleting"
      @confirm="onDelete"
    />
  </div>
</template>
