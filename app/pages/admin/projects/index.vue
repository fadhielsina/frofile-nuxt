<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from '@lucide/vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { items: projects, pending, refresh, create, update, remove } = useCrud<Project>('projects')
await refresh()

const emptyForm = () => ({
  title: '',
  slug: '',
  summary: '',
  description: '',
  coverImageUrl: '',
  projectUrl: '',
  repoUrl: '',
  tagsInput: '',
  featured: false,
  sortOrder: projects.value.length
})

const dialogOpen = ref(false)
const editing = ref<Project | null>(null)
const saving = ref(false)
const form = reactive(emptyForm())

const confirmOpen = ref(false)
const toDelete = ref<Project | null>(null)
const deleting = ref(false)

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function onTitleInput() {
  if (!editing.value) form.slug = slugify(form.title)
}

function openCreate() {
  editing.value = null
  Object.assign(form, emptyForm())
  dialogOpen.value = true
}

function openEdit(project: Project) {
  editing.value = project
  Object.assign(form, project, { tagsInput: (project.tags || []).join(', ') })
  dialogOpen.value = true
}

async function onSubmit() {
  saving.value = true
  try {
    const { tagsInput, ...rest } = form
    const payload = {
      ...rest,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }
    if (editing.value) await update(editing.value.id, payload)
    else await create(payload)
    toast.success('Project saved.')
    dialogOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not save project.')
  } finally {
    saving.value = false
  }
}

function askDelete(project: Project) {
  toDelete.value = project
  confirmOpen.value = true
}

async function onDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await remove(toDelete.value.id)
    toast.success('Project deleted.')
    confirmOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Could not delete project.')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AdminPageHeader title="Projects" description="Shown as cards on the public site.">
      <template #actions>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add project</Button>
      </template>
    </AdminPageHeader>

    <EmptyState v-if="!pending && !projects.length" title="No projects yet">
      <template #action>
        <Button @click="openCreate"><Plus class="mr-1.5 h-4 w-4" /> Add project</Button>
      </template>
    </EmptyState>

    <div v-else class="space-y-3">
      <Card v-for="project in projects" :key="project.id">
        <CardContent class="flex items-center justify-between gap-4 pt-6">
          <div>
            <p class="flex items-center gap-2 font-medium">
              {{ project.title }}
              <Badge v-if="project.featured" variant="secondary">Featured</Badge>
            </p>
            <p class="text-sm text-muted-foreground">{{ project.summary }}</p>
          </div>
          <div class="flex gap-1">
            <Button size="icon" variant="ghost" @click="openEdit(project)"><Pencil class="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" @click="askDelete(project)"><Trash2 class="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editing ? 'Edit project' : 'Add project' }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div class="grid gap-1.5">
            <Label for="title">Title</Label>
            <Input id="title" v-model="form.title" required @input="onTitleInput" />
          </div>
          <div class="grid gap-1.5">
            <Label for="slug">Slug</Label>
            <Input id="slug" v-model="form.slug" required placeholder="my-project" />
          </div>
          <div class="grid gap-1.5">
            <Label for="summary">Summary</Label>
            <Input id="summary" v-model="form.summary" placeholder="One-line summary" />
          </div>
          <div class="grid gap-1.5">
            <Label for="description">Description</Label>
            <Textarea id="description" v-model="form.description" rows="3" />
          </div>
          <div class="grid gap-1.5">
            <Label for="coverImageUrl">Cover image URL</Label>
            <Input id="coverImageUrl" v-model="form.coverImageUrl" placeholder="https://..." />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-1.5">
              <Label for="projectUrl">Live URL</Label>
              <Input id="projectUrl" v-model="form.projectUrl" placeholder="https://..." />
            </div>
            <div class="grid gap-1.5">
              <Label for="repoUrl">Repo URL</Label>
              <Input id="repoUrl" v-model="form.repoUrl" placeholder="https://github.com/..." />
            </div>
          </div>
          <div class="grid gap-1.5">
            <Label for="tags">Tags (comma separated)</Label>
            <Input id="tags" v-model="form.tagsInput" placeholder="nuxt, typescript, tailwind" />
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.featured" type="checkbox" class="h-4 w-4 rounded border-input" />
              Featured
            </label>
            <div class="grid gap-1.5">
              <Label for="sortOrder">Sort order</Label>
              <Input id="sortOrder" v-model.number="form.sortOrder" type="number" class="w-24" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete project?"
      :description="`This will remove '${toDelete?.title}' permanently.`"
      :loading="deleting"
      @confirm="onDelete"
    />
  </div>
</template>
