import { asc } from 'drizzle-orm'
import { useDb } from '../db'
import { fallbackEducation } from '../../shared/data/fallback'

export default defineEventHandler((event) =>
  withFallback(
    event,
    async () => {
      const { db, schema } = await useDb()
      return (await db.select().from(schema.education).orderBy(asc(schema.education.sortOrder))) as Education[]
    },
    fallbackEducation
  )
)
