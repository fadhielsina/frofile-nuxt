import { asc, desc } from 'drizzle-orm'
import { useDb } from '../db'
import { fallbackProjects } from '../../shared/data/fallback'

export default defineEventHandler((event) =>
  withFallback(
    event,
    async () => {
      const { db, schema } = await useDb()
      return (await db
        .select()
        .from(schema.projects)
        .orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))) as Project[]
    },
    fallbackProjects
  )
)
