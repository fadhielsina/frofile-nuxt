import { useDb } from '../db'

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const data = await readValidatedBody(event, messageSchema.parse)

  await db.insert(schema.messages).values(data)

  return { ok: true }
})
