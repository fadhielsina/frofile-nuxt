import { asc } from 'drizzle-orm'
import { useDb } from '../db'
import { fallbackExperiences } from '../../shared/data/fallback'

export default defineEventHandler((event) =>
  withFallback(
    event,
    async () => {
      const { db, schema } = await useDb()
      return (await db.select().from(schema.experiences).orderBy(asc(schema.experiences.sortOrder))) as Experience[]
    },
    fallbackExperiences
  )
)
