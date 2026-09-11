/**
 * Runtime database factory.
 *
 * The active provider is selected purely from environment variables
 * (DB_PROVIDER + DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME, or DB_URL) —
 * no code changes needed to switch between MySQL, PostgreSQL, or SQLite.
 * See .env.example for every supported variable.
 *
 * Every route imports `useDb()` and gets back `{ db, schema, provider }`.
 * `schema` always exposes the same table names/columns (see server/db/schema/*.ts),
 * so route/query code never needs to branch on the provider.
 */
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import * as pgSchema from './schema/pg'
import * as mysqlSchema from './schema/mysql'
import * as sqliteSchema from './schema/sqlite'

export type Provider = 'pg' | 'mysql' | 'sqlite'
export type AnyDb = any
export type AnySchema = typeof pgSchema | typeof mysqlSchema | typeof sqliteSchema

interface DbHandle {
  db: AnyDb
  schema: AnySchema
  provider: Provider
}

let handlePromise: Promise<DbHandle> | null = null

function normalizeProvider(raw: string): Provider {
  const v = (raw || 'sqlite').toLowerCase().trim()
  if (['pg', 'postgres', 'postgresql'].includes(v)) return 'pg'
  if (['mysql', 'mysql2', 'mariadb'].includes(v)) return 'mysql'
  if (['sqlite', 'sqlite3', 'better-sqlite3'].includes(v)) return 'sqlite'
  throw new Error(
    `Unsupported DB_PROVIDER "${raw}". Use one of: postgres, mysql, sqlite.`
  )
}

// Kept small on purpose: on serverless (Vercel) every cold start spins up its
// own pool, so a high per-instance limit can exhaust the database's total
// connection budget under concurrent traffic.
const SERVERLESS_POOL_SIZE = 3

function buildPgConfig(cfg: ReturnType<typeof useRuntimeConfig>) {
  if (cfg.dbUrl) return { connectionString: cfg.dbUrl, max: SERVERLESS_POOL_SIZE }
  return {
    host: cfg.dbHost,
    port: cfg.dbPort ? Number(cfg.dbPort) : 5432,
    user: cfg.dbUser,
    password: cfg.dbPassword,
    database: cfg.dbName,
    ssl: cfg.dbSsl === 'true' ? { rejectUnauthorized: false } : undefined,
    max: SERVERLESS_POOL_SIZE
  }
}

function buildMysqlConfig(cfg: ReturnType<typeof useRuntimeConfig>) {
  if (cfg.dbUrl) return { uri: cfg.dbUrl, connectionLimit: SERVERLESS_POOL_SIZE }
  return {
    host: cfg.dbHost,
    port: cfg.dbPort ? Number(cfg.dbPort) : 3306,
    user: cfg.dbUser,
    password: cfg.dbPassword,
    database: cfg.dbName,
    ssl: cfg.dbSsl === 'true' ? {} : undefined,
    connectionLimit: SERVERLESS_POOL_SIZE
  }
}

async function createHandle(): Promise<DbHandle> {
  const cfg = useRuntimeConfig()
  const provider = normalizeProvider(cfg.dbProvider)

  if (provider === 'pg') {
    const [{ Pool }, { drizzle }] = await Promise.all([
      import('pg'),
      import('drizzle-orm/node-postgres')
    ])
    const pool = new Pool(buildPgConfig(cfg))
    return { db: drizzle(pool, { schema: pgSchema }), schema: pgSchema, provider }
  }

  if (provider === 'mysql') {
    const [{ default: mysql }, { drizzle }] = await Promise.all([
      import('mysql2/promise'),
      import('drizzle-orm/mysql2')
    ])
    const pool = mysql.createPool(buildMysqlConfig(cfg))
    return { db: drizzle(pool, { schema: mysqlSchema, mode: 'default' }), schema: mysqlSchema, provider }
  }

  const [{ default: Database }, { drizzle }] = await Promise.all([
    import('better-sqlite3'),
    import('drizzle-orm/better-sqlite3')
  ])
  const file = resolve(cfg.dbFile || '.data/frofile.sqlite')
  mkdirSync(dirname(file), { recursive: true })
  const sqlite = new Database(file)
  sqlite.pragma('journal_mode = WAL')
  return { db: drizzle(sqlite, { schema: sqliteSchema }), schema: sqliteSchema, provider }
}

/**
 * Lazily creates (once) and returns the active db client + matching schema.
 * Call this from any server route/util instead of importing a driver directly.
 */
export function useDb(): Promise<DbHandle> {
  if (!handlePromise) {
    handlePromise = createHandle().catch((err) => {
      handlePromise = null // allow retrying on the next request instead of caching a broken connection
      throw err
    })
  }
  return handlePromise
}

/**
 * Insert one row and return its new numeric id — works the same regardless
 * of provider, hiding the fact that only Postgres/SQLite support `RETURNING`
 * while MySQL needs `$returningId()`.
 */
export async function insertOne(
  db: AnyDb,
  provider: Provider,
  table: any,
  values: Record<string, unknown>
): Promise<number> {
  if (provider === 'mysql') {
    const [row] = await db.insert(table).values(values).$returningId()
    return Number((row as any).id)
  }
  const [row] = await db.insert(table).values(values).returning({ id: table.id })
  return Number(row.id)
}
