import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(schema.projects).where(eq(schema.projects.id, id))
  return { ok: true }
})
