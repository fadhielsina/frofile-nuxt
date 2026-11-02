import { asc } from 'drizzle-orm'
import { useDb } from '../db'
import { fallbackSkills } from '../../shared/data/fallback'

export default defineEventHandler((event) =>
  withFallback(
    event,
    async () => {
      const { db, schema } = await useDb()
      return (await db
        .select()
        .from(schema.skills)
        .orderBy(asc(schema.skills.sortOrder), asc(schema.skills.name))) as Skill[]
    },
    fallbackSkills
  )
)
