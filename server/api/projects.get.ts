import { asc, desc } from 'drizzle-orm'
import { useDb } from '../db'

export default defineEventHandler(async () => {
  const { db, schema } = await useDb()
  return db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt))
})
