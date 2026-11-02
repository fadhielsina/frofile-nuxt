<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitBranch, ExternalLink } from '@lucide/vue'

defineProps<{ project: Project }>()
</script>

<template>
  <Card class="glass glass-hover flex h-full flex-col overflow-hidden rounded-2xl">
    <div v-if="project.coverImageUrl" class="aspect-video w-full overflow-hidden bg-muted">
      <img :src="project.coverImageUrl" :alt="project.title" class="h-full w-full object-cover" />
    </div>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        {{ project.title }}
        <Badge v-if="project.featured" variant="secondary">Featured</Badge>
      </CardTitle>
      <CardDescription>{{ project.summary }}</CardDescription>
    </CardHeader>
    <CardContent class="flex-1">
      <div v-if="project.tags?.length" class="flex flex-wrap gap-2">
        <Badge v-for="tag in project.tags" :key="tag" variant="outline">{{ tag }}</Badge>
      </div>
    </CardContent>
    <CardFooter class="gap-2">
      <Button v-if="project.projectUrl" as-child size="sm" variant="default">
        <a :href="project.projectUrl" target="_blank" rel="noopener">
          <ExternalLink class="mr-1.5 h-4 w-4" /> Live
        </a>
      </Button>
      <Button v-if="project.repoUrl" as-child size="sm" variant="outline">
        <a :href="project.repoUrl" target="_blank" rel="noopener">
          <GitBranch class="mr-1.5 h-4 w-4" /> Code
        </a>
      </Button>
    </CardFooter>
  </Card>
</template>
