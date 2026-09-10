import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const data = await readValidatedBody(event, projectSchema.parse)

  try {
    await db.update(schema.projects).set(data).where(eq(schema.projects.id, id))
    return { id, ...data }
  } catch (err: any) {
    if (String(err?.message || '').match(/unique|duplicate/i)) {
      throw createError({ statusCode: 409, statusMessage: 'A project with this slug already exists.' })
    }
    throw err
  }
})
