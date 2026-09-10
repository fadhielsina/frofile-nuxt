import { insertOne, useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema, provider } = await useDb()
  const data = await readValidatedBody(event, experienceSchema.parse)
  const id = await insertOne(db, provider, schema.experiences, data)
  return { id, ...data }
})
