// Augments nuxt-auth-utils' session shape with our own admin user fields.
declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
  }

  interface UserSession {
    user: User
    loggedInAt: number
  }
}

export {}
