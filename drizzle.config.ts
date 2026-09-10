/**
 * drizzle-kit config for `db:generate` / `db:push` / `db:studio`.
 * Reads the very same DB_PROVIDER / DB_* env vars used at runtime (see .env),
 * so migrations always target whichever database is currently configured.
 */
import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

const raw = (process.env.DB_PROVIDER || 'sqlite').toLowerCase()
const provider = ['pg', 'postgres', 'postgresql'].includes(raw)
  ? 'postgresql'
  : ['mysql', 'mysql2', 'mariadb'].includes(raw)
    ? 'mysql'
    : 'sqlite'

const schemaByProvider = {
  postgresql: './server/db/schema/pg.ts',
  mysql: './server/db/schema/mysql.ts',
  sqlite: './server/db/schema/sqlite.ts'
} as const

const dbCredentials =
  provider === 'sqlite'
    ? { url: process.env.DB_FILE || '.data/frofile.sqlite' }
    : process.env.DB_URL
      ? { url: process.env.DB_URL }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT) || (provider === 'mysql' ? 3306 : 5432),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: process.env.DB_SSL === 'true'
        }

export default defineConfig({
  dialect: provider,
  schema: schemaByProvider[provider],
  out: `./server/db/migrations/${provider}`,
  dbCredentials: dbCredentials as any
})
