import request from 'supertest'
import { app, initializeApp } from '../index'
import { setupTestDatabase, resetTestData, teardownTestDatabase } from './testUtils'

describe('Phrases API Integration Tests', () => {
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

  describe('GET /api/phrases/', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/api/phrases/')

      expect(response.status).toBe(200)
      expect(response.text).toBe('Welcome to phrases router')
    })
  })

  describe('GET /api/phrases/random', () => {
    it('should return a random phrase', async () => {
      const response = await request(app).get('/api/phrases/random')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('text')
      expect(response.body).toHaveProperty('author')
      expect(response.body).toHaveProperty('date')
      expect(typeof response.body.id).toBe('number')
      expect(typeof response.body.text).toBe('string')
      expect(typeof response.body.author).toBe('string')
      expect(typeof response.body.date).toBe('string')
    })
  })

  describe('GET /api/phrases/date/:date', () => {
    it('should return a phrase for a specific date', async () => {
      // Test with a known date that has a phrase
      const response = await request(app).get('/api/phrases/date/01-01')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('text')
      expect(response.body).toHaveProperty('author')
      expect(response.body).toHaveProperty('date', '01-01')
    })

    it('should return null for date with no phrases', async () => {
      const response = await request(app).get('/api/phrases/date/99-99')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'No phrase found for date' })
    })
  })

  describe('GET /api/phrases/daily', () => {
    it('should return daily phrase or 404 if none exists', async () => {
      const response = await request(app).get('/api/phrases/daily')

      if (response.status === 200) {
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('text')
        expect(response.body).toHaveProperty('author')
        expect(response.body).toHaveProperty('date')
      } else {
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'No phrase found for today' })
      }
    })
  })
})
