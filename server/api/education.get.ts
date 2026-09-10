import { asc } from 'drizzle-orm'
import { useDb } from '../db'

export default defineEventHandler(async () => {
  const { db, schema } = await useDb()
  return db.select().from(schema.education).orderBy(asc(schema.education.sortOrder))
})
