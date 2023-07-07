import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// for migrations
// const migrationClient = postgres('postgres://postgres:admin@0.0.0.0:5432/postgres', { max: 1 })

// for query purposes
const queryClient = postgres('postgres://postgres:admin@0.0.0.0:5432/postgres')
export const db: PostgresJsDatabase = drizzle(queryClient)
