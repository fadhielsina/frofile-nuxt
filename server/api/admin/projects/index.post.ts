import { insertOne, useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema, provider } = await useDb()
  const data = await readValidatedBody(event, projectSchema.parse)

  try {
    const id = await insertOne(db, provider, schema.projects, data)
    return { id, ...data }
  } catch (err: any) {
    if (String(err?.message || '').match(/unique|duplicate/i)) {
      throw createError({ statusCode: 409, statusMessage: 'A project with this slug already exists.' })
    }
    throw err
  }
})
