import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL)
    throw new Error('Please provide a DATABASE_URL environment variable.')

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId)

  process.env.DATABASE_URL = databaseURL

  execSync('yarn prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId} CASCADE"`)

  await prisma.$disconnect()
})
