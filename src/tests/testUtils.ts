import fs from 'fs'
import { closeDatabase, resetDatabase } from '../db/db'

export function setupTestDatabase (): void {
  // Ensure NODE_ENV is set to test
  process.env.NODE_ENV = 'test'

  // Clean up any existing test database
  if (fs.existsSync('test.sqlite')) {
    fs.unlinkSync('test.sqlite')
  }
}

export function resetTestData (): void {
  // Reset database connection to get fresh data
  resetDatabase()
}

export function teardownTestDatabase (): void {
  // Close database connection
  closeDatabase()

  // Clean up test database file
  if (fs.existsSync('test.sqlite')) {
    fs.unlinkSync('test.sqlite')
  }
}
