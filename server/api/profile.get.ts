import { useDb } from '../db'
import { fallbackProfile } from '../../shared/data/fallback'

export default defineEventHandler((event) =>
  withFallback(
    event,
    async () => {
      const { db, schema } = await useDb()
      const [row] = await db.select().from(schema.profile).limit(1)
      return (row as Profile | undefined) ?? fallbackProfile
    },
    fallbackProfile
  )
)
