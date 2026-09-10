import { useDb } from '../../db'

/**
 * Tells the CMS whether an admin account already exists.
 * Used by the login page to show "create admin" (first run) vs "sign in".
 */
export default defineEventHandler(async () => {
  const { db, schema } = await useDb()
  const existing = await db.select({ id: schema.adminUsers.id }).from(schema.adminUsers).limit(1)
  return { hasAdmin: existing.length > 0 }
})
