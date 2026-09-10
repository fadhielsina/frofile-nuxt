import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb } from '../../db'

const bodySchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(255)
})

export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const [admin] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email.toLowerCase()))
    .limit(1)

  if (!admin) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  const valid = await verifyPassword(admin.passwordHash, password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  await setUserSession(event, {
    user: { id: admin.id, name: admin.name, email: admin.email },
    loggedInAt: Date.now()
  })

  return { ok: true }
})
