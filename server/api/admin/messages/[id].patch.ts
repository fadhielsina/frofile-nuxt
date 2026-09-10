import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDb } from '../../../db'

const bodySchema = z.object({ read: z.coerce.boolean() })

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const { read } = await readValidatedBody(event, bodySchema.parse)

  await db.update(schema.messages).set({ read }).where(eq(schema.messages.id, id))
  return { ok: true }
})
