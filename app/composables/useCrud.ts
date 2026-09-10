/**
 * Generic list/create/update/delete composable shared by every CMS resource
 * page (skills, experiences, education, projects, messages) so each admin
 * page only has to describe its form shape, not repeat fetch boilerplate.
 */
export function useCrud<T extends { id: number }>(resource: string, opts?: { listPath?: string }) {
  const listPath = opts?.listPath ?? `/api/${resource}`
  const adminPath = `/api/admin/${resource}`

  const items = ref<T[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function refresh() {
    pending.value = true
    error.value = null
    try {
      items.value = await $fetch<T[]>(listPath)
    } catch (e: any) {
      error.value = e?.data?.statusMessage || e?.message || 'Failed to load data.'
    } finally {
      pending.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const created = await $fetch<T>(adminPath, { method: 'POST', body: payload })
    await refresh()
    return created
  }

  async function update(id: number, payload: Record<string, unknown>) {
    const updated = await $fetch<T>(`${adminPath}/${id}`, { method: 'PUT', body: payload })
    await refresh()
    return updated
  }

  async function patch(id: number, payload: Record<string, unknown>) {
    const updated = await $fetch<T>(`${adminPath}/${id}`, { method: 'PATCH', body: payload })
    await refresh()
    return updated
  }

  async function remove(id: number) {
    await $fetch(`${adminPath}/${id}`, { method: 'DELETE' })
    items.value = items.value.filter((i) => i.id !== id)
  }

  return { items, pending, error, refresh, create, update, patch, remove }
}
