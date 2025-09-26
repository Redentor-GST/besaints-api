import express from 'express'
import request from 'supertest'
import saintsRouter from '../routes/saintsRouter'

// Mock the service
jest.mock('../services/saintsService', () => {
  return jest.fn().mockImplementation(() => ({
    getSaints: jest.fn(),
    getSaintById: jest.fn(),
    getSaintByName: jest.fn(),
    getSaintsByDate: jest.fn(),
    searchSaints: jest.fn()
  }))
})

const app = express()
app.use(express.json())
app.use('/api/saints', saintsRouter)

describe('Saints API', () => {
  let mockSaintsService: any

  beforeEach(() => {
    jest.clearAllMocks()
    // Get the mocked service instance
    const SaintsService = require('../services/saintsService').default
    mockSaintsService = new SaintsService()
  })

  describe('GET /api/saints/all', () => {
    it('should return all saints', async () => {
      const mockSaints = [
        { id: 1, name: 'Saint 1', date: '01-01', description: 'Description 1' },
        { id: 2, name: 'Saint 2', date: '01-02', description: 'Description 2' }
      ]
      mockSaintsService.getSaints.mockReturnValue(mockSaints)

      const response = await request(app).get('/api/saints/all')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSaints)
      expect(mockSaintsService.getSaints).toHaveBeenCalledTimes(1)
    })

    it('should handle service errors', async () => {
      mockSaintsService.getSaints.mockImplementation(() => {
        throw new Error('Database error')
      })

      const response = await request(app).get('/api/saints/all')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch saints' })
    })
  })

  describe('GET /api/saints/:id', () => {
    const mockSaint = {
      id: 1,
      name: 'Saint by ID',
      date: '01-01',
      description: 'Description by ID'
    }

    it('should return a saint by id', async () => {
      mockSaintsService.getSaintById.mockReturnValue(mockSaint)

      const response = await request(app).get('/api/saints/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSaint)
      expect(mockSaintsService.getSaintById).toHaveBeenCalledWith(1)
    })

    it('should return 400 for invalid id', async () => {
      const response = await request(app).get('/api/saints/abc')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid ID' })
    })

    it('should return 404 for non-existent saint', async () => {
      mockSaintsService.getSaintById.mockReturnValue(undefined)

      const response = await request(app).get('/api/saints/999')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Saint not found' })
    })

    it('should handle service errors', async () => {
      mockSaintsService.getSaintById.mockImplementation(() => {
        throw new Error('Database error')
      })

      const response = await request(app).get('/api/saints/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch saint' })
    })
  })

  describe('GET /api/saints/name/:name', () => {
    const mockSaint = {
      id: 1,
      name: 'Test Saint',
      date: '01-01',
      description: 'Test Description'
    }

    it('should return a saint by name', async () => {
      mockSaintsService.getSaintByName.mockReturnValue(mockSaint)

      const response = await request(app).get('/api/saints/name/Test%20Saint')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSaint)
      expect(mockSaintsService.getSaintByName).toHaveBeenCalledWith(
        'Test Saint'
      )
    })

    it('should return 404 for non-existent saint', async () => {
      mockSaintsService.getSaintByName.mockReturnValue(undefined)

      const response = await request(app).get('/api/saints/name/NonExistent')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Saint not found' })
    })

    it('should handle service errors', async () => {
      mockSaintsService.getSaintByName.mockImplementation(() => {
        throw new Error('Database error')
      })

      const response = await request(app).get('/api/saints/name/Test%20Saint')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch saint by name' })
    })
  })

  describe('GET /api/saints/date/:date', () => {
    it('should return saints by date', async () => {
      const mockSaints = [
        { id: 1, name: 'Saint A', date: '01-01', description: 'Description A' },
        { id: 2, name: 'Saint B', date: '01-01', description: 'Description B' }
      ]
      mockSaintsService.getSaintsByDate.mockReturnValue(mockSaints)

      const response = await request(app).get('/api/saints/date/01-01')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSaints)
      expect(mockSaintsService.getSaintsByDate).toHaveBeenCalledWith('01-01')
    })

    it('should handle service errors', async () => {
      mockSaintsService.getSaintsByDate.mockImplementation(() => {
        throw new Error('Database error')
      })

      const response = await request(app).get('/api/saints/date/01-01')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Failed to fetch saints by date'
      })
    })
  })

  describe('GET /api/saints/search/:query', () => {
    it('should return saints matching search query', async () => {
      const mockSaints = [
        {
          id: 1,
          name: 'Saint John',
          date: '01-01',
          description: 'Description of John'
        }
      ]
      mockSaintsService.searchSaints.mockReturnValue(mockSaints)

      const response = await request(app).get('/api/saints/search/John')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockSaints)
      expect(mockSaintsService.searchSaints).toHaveBeenCalledWith('John')
    })

    it('should handle service errors', async () => {
      mockSaintsService.searchSaints.mockImplementation(() => {
        throw new Error('Database error')
      })

      const response = await request(app).get('/api/saints/search/John')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to search saints' })
    })
  })
})
