import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const data = await readValidatedBody(event, skillSchema.parse)

  await db.update(schema.skills).set(data).where(eq(schema.skills.id, id))
  return { id, ...data }
})
