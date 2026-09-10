import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const data = await readValidatedBody(event, educationSchema.parse)

  await db.update(schema.education).set(data).where(eq(schema.education.id, id))
  return { id, ...data }
})
