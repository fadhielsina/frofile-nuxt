import { insertOne, useDb } from '../../../db'

export default defineEventHandler(async (event) => {
  const { db, schema, provider } = await useDb()
  const data = await readValidatedBody(event, skillSchema.parse)
  const id = await insertOne(db, provider, schema.skills, data)
  return { id, ...data }
})
