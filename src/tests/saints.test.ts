import request from 'supertest'
import { app, initializeApp } from '../index'
import { setupTestDatabase, resetTestData, teardownTestDatabase } from './testUtils'

describe('Saints API Integration Tests', () => {
  beforeAll(async () => {
    setupTestDatabase()
    await initializeApp()
  })

  beforeEach(() => {
    resetTestData()
  })

  afterAll(() => {
    teardownTestDatabase()
  })

  describe('GET /api/saints/', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/api/saints/')

      expect(response.status).toBe(200)
      expect(response.text).toBe('Welcome to saints router')
    })
  })

  describe('GET /api/saints/name/:name', () => {
    it('should return a saint by exact name match', async () => {
      // Test with a known saint name from the database
      const response = await request(app).get('/api/saints/name/s.%20Antonio,%20abad')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('date')
      expect(response.body).toHaveProperty('description')
    })

    it('should handle URL encoded names with spaces', async () => {
      const saintName = 's. Vicente María Strambi, Presbítero Pasionista, obispo'
      const encodedName = encodeURIComponent(saintName)

      const response = await request(app).get(`/api/saints/name/${encodedName}`)

      expect(response.status).toBe(200)
      expect(response.body.name).toBe(saintName)
    })

    it('should return 404 for non-existent saint name', async () => {
      const response = await request(app).get('/api/saints/name/NonExistentSaint')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Saint not found' })
    })

    it('should be case sensitive', async () => {
      const response = await request(app).get('/api/saints/name/s.%20antonio,%20abad')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Saint not found' })
    })
  })

  describe('GET /api/saints/date/:date', () => {
    it('should return a saint for a specific date', async () => {
      // Test with a known date that has a saint
      const response = await request(app).get('/api/saints/date/01-01')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('date', '01-01')
      expect(response.body).toHaveProperty('description')
    })

    it('should return null for date with no saints', async () => {
      const response = await request(app).get('/api/saints/date/99-99')

      expect(response.status).toBe(200)
      expect(response.body === null || response.body === '').toBe(true)
    })
  })

  describe('GET /api/saints/daily', () => {
    it('should return a saint for today\'s date or empty response', async () => {
      const response = await request(app).get('/api/saints/daily')

      expect(response.status).toBe(200)
      // Since we don't know if there's a saint for today, we check both possibilities
      if (response.body != null && typeof response.body === 'object' && 'name' in response.body) {
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('date')
        expect(response.body).toHaveProperty('description')
      } else {
        // No saint for today - that's also valid
        expect(response.body === null || response.body === '').toBe(true)
      }
    })
  })
})
