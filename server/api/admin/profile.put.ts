import { eq } from 'drizzle-orm'
import { useDb } from '../../db'

/** Upserts the single profile row (created on first save). */
export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const data = await readValidatedBody(event, profileSchema.parse)

  const [existing] = await db.select({ id: schema.profile.id }).from(schema.profile).limit(1)

  if (existing) {
    await db.update(schema.profile).set(data).where(eq(schema.profile.id, existing.id))
  } else {
    await db.insert(schema.profile).values(data)
  }

  const [row] = await db.select().from(schema.profile).limit(1)
  return row
})
