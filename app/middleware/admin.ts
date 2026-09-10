export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch } = useUserSession()

  // On full page load (SSR) the session may not be hydrated yet.
  if (!loggedIn.value) await fetch()

  if (!loggedIn.value) {
    return navigateTo('/admin/login')
  }
})
