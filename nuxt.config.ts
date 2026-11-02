// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-auth-utils', 'motion-v/nuxt'],

  // Flat (no folder-prefixed) component names across every app/components/**
  // subfolder — <Container>, <HeroSection>, <FadeIn>, <AdminSidebar>, etc.
  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/main.css'],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  runtimeConfig: {
    // server-only (never exposed to the client)
    // 'static' (default) = public pages use hardcoded data from shared/data/fallback.ts
    // and never touch the database. Set DATA_SOURCE=database to read from the DB
    // (hardcoded data is then only a backup if the DB errors).
    dataSource: process.env.DATA_SOURCE || 'static',

    dbProvider: process.env.DB_PROVIDER || 'sqlite',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'frofile',
    dbSsl: process.env.DB_SSL || 'false',
    dbFile: process.env.DB_FILE || '.data/frofile.sqlite',
    dbUrl: process.env.DB_URL || '',

    session: {
      // used by nuxt-auth-utils to seal the session cookie
      password: process.env.NUXT_SESSION_PASSWORD || ''
    },

    public: {
      // contact form needs the DB; otherwise direct links are shown
      contactForm: process.env.DATA_SOURCE === 'database',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'My Profile'
    }
  },

  typescript: {
    strict: true
  }
})
