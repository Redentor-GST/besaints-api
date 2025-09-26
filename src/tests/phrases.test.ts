import express from 'express'
import request from 'supertest'
import phrasesRouter from '../routes/phrasesRouter'

const app = express()
app.use(express.json())
app.use('/api/phrases', phrasesRouter)

describe('Phrases API', () => {
  describe('GET /api/phrases/all', () => {
    it('should return all phrases', async () => {
      const response = await request(app).get('/api/phrases/all')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
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
    })
  })

  describe('GET /api/phrases/:id', () => {
    it('should return 400 for invalid id', async () => {
      const response = await request(app).get('/api/phrases/abc')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid ID' })
    })

    it('should return 404 for non-existent phrase', async () => {
      const response = await request(app).get('/api/phrases/999')
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Phrase not found' })
    })
  })

  describe('GET /api/phrases/author/:author', () => {
    it('should return phrases by author', async () => {
      const response = await request(app).get(
        '/api/phrases/author/San%20Pablo'
      )
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('GET /api/phrases/date/:date', () => {
    it('should return phrases by date', async () => {
      const response = await request(app).get('/api/phrases/date/01-01')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('GET /api/phrases/daily', () => {
    it('should return daily phrase or 404', async () => {
      const response = await request(app).get('/api/phrases/daily')
      expect([200, 404]).toContain(response.status)
      if (response.status === 200) {
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('text')
        expect(response.body).toHaveProperty('author')
        expect(response.body).toHaveProperty('date')
      } else {
        expect(response.body).toEqual({ error: 'No phrase found for today' })
      }
    })
  })
})
