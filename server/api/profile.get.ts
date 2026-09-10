import { useDb } from '../db'

export default defineEventHandler(async () => {
  const { db, schema } = await useDb()
  const [row] = await db.select().from(schema.profile).limit(1)
  return row || null
})
