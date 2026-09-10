/**
 * Guards every `/api/admin/**` route (CMS write/read-private endpoints) behind
 * the admin session. Public read endpoints live under `/api/<resource>` and
 * are untouched by this middleware.
 */
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin/')) return
  await requireUserSession(event)
})
