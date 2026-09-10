import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const data = await readValidatedBody(event, experienceSchema.parse)

  await db.update(schema.experiences).set(data).where(eq(schema.experiences.id, id))
  return { id, ...data }
})
