import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(schema.education).where(eq(schema.education.id, id))
  return { ok: true }
})
