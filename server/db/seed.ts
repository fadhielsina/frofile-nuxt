/**
 * Seeds sample profile content (skills / experience / education / projects)
 * so the site and CMS aren't empty on first run.
 *
 * Run with: npm run db:seed
 * Does NOT create the admin account — that happens on first visit to
 * /admin/login via the "create admin" form (see app/pages/admin/login.vue).
 */
import 'dotenv/config'
import { resolve, dirname } from 'node:path'
import { mkdirSync } from 'node:fs'

async function main() {
  const raw = (process.env.DB_PROVIDER || 'sqlite').toLowerCase()
  const provider = ['pg', 'postgres', 'postgresql'].includes(raw)
    ? 'pg'
    : ['mysql', 'mysql2', 'mariadb'].includes(raw)
      ? 'mysql'
      : 'sqlite'

  let db: any
  let schema: any

  if (provider === 'pg') {
    const { Pool } = await import('pg')
    const { drizzle } = await import('drizzle-orm/node-postgres')
    schema = await import('./schema/pg')
    const pool = new Pool(
      process.env.DB_URL
        ? { connectionString: process.env.DB_URL }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
          }
    )
    db = drizzle(pool, { schema })
  } else if (provider === 'mysql') {
    const mysql = await import('mysql2/promise')
    const { drizzle } = await import('drizzle-orm/mysql2')
    schema = await import('./schema/mysql')
    const pool = mysql.createPool(
      process.env.DB_URL || {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? {} : undefined
      }
    )
    db = drizzle(pool, { schema, mode: 'default' })
  } else {
    const { default: Database } = await import('better-sqlite3')
    const { drizzle } = await import('drizzle-orm/better-sqlite3')
    schema = await import('./schema/sqlite')
    const file = resolve(process.env.DB_FILE || '.data/frofile.sqlite')
    mkdirSync(dirname(file), { recursive: true })
    const sqlite = new Database(file)
    sqlite.pragma('journal_mode = WAL')
    db = drizzle(sqlite, { schema })
  }

  const existingProfile = await db.select({ id: schema.profile.id }).from(schema.profile).limit(1)
  if (existingProfile.length === 0) {
    await db.insert(schema.profile).values({
      name: 'Your Name',
      headline: 'Full-Stack Developer',
      bio: 'Write a short bio about yourself here. Edit this from the CMS at /admin once you log in.',
      avatarUrl: '',
      resumeUrl: '',
      email: 'you@example.com',
      phone: '',
      location: 'Earth',
      socials: { github: '', linkedin: '', twitter: '' }
    })
    console.log('✓ seeded profile')
  }

  const existingSkills = await db.select({ id: schema.skills.id }).from(schema.skills).limit(1)
  if (existingSkills.length === 0) {
    await db.insert(schema.skills).values([
      { name: 'TypeScript', category: 'Language', level: 5, sortOrder: 0 },
      { name: 'Vue / Nuxt', category: 'Frontend', level: 5, sortOrder: 1 },
      { name: 'Node.js', category: 'Backend', level: 4, sortOrder: 2 },
      { name: 'PostgreSQL', category: 'Database', level: 4, sortOrder: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 5, sortOrder: 4 }
    ])
    console.log('✓ seeded skills')
  }

  const existingProjects = await db.select({ id: schema.projects.id }).from(schema.projects).limit(1)
  if (existingProjects.length === 0) {
    await db.insert(schema.projects).values([
      {
        title: 'Sample Project',
        slug: 'sample-project',
        summary: 'A short one-line summary of this project.',
        description: 'A longer description of what this project does and the problem it solves.',
        coverImageUrl: '',
        projectUrl: '',
        repoUrl: '',
        tags: ['nuxt', 'typescript'],
        featured: true,
        sortOrder: 0
      }
    ])
    console.log('✓ seeded projects')
  }

  console.log(`Done. Provider: ${provider}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
