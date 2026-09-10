import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(schema.experiences).where(eq(schema.experiences.id, id))
  return { ok: true }
})
