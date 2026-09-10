import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb } from '../../db'

const bodySchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(255)
})

/**
 * Creates the single admin account. Only works while no admin exists yet
 * (first-run bootstrap) — after that this route always rejects.
 */
export default defineEventHandler(async (event) => {
  const { db, schema } = await useDb()

  const existing = await db.select({ id: schema.adminUsers.id }).from(schema.adminUsers).limit(1)
  if (existing.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'An admin account already exists.' })
  }

  const parsed = await readValidatedBody(event, bodySchema.parse)
  const passwordHash = await hashPassword(parsed.password)

  await db.insert(schema.adminUsers).values({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    passwordHash
  })

  const [created] = await db
    .select({ id: schema.adminUsers.id, name: schema.adminUsers.name, email: schema.adminUsers.email })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, parsed.email.toLowerCase()))
    .limit(1)

  await setUserSession(event, {
    user: { id: created.id, name: created.name, email: created.email },
    loggedInAt: Date.now()
  })

  return { ok: true }
})
