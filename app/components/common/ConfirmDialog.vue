<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/**
 * Reusable "are you sure?" dialog for destructive admin actions
 * (used by every CMS list page before a delete call).
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    loading?: boolean
  }>(),
  {
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    loading: false
  }
)

const emit = defineEmits<{ 'update:open': [boolean]; confirm: [] }>()
</script>

<template>
  <Dialog :open="props.open" @update:open="(v) => emit('update:open', v)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" :disabled="loading" @click="emit('update:open', false)">Cancel</Button>
        <Button variant="destructive" :disabled="loading" @click="emit('confirm')">
          {{ loading ? 'Deleting…' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
