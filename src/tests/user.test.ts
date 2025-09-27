import request from 'supertest'
import { app, initializeApp } from '../index'
import { setupTestDatabase, resetTestData, teardownTestDatabase } from './testUtils'
import { RegisterDevicePayload } from '../types'

describe('User API Integration Tests', () => {
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

  describe('GET /user/', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/user/')

      expect(response.status).toBe(200)
      expect(response.text).toBe('Welcome to user router')
    })
  })

  describe('POST /user/register', () => {
    const validPayload: RegisterDevicePayload = {
      deviceId: 'test-device-123',
      expoPushToken: 'ExponentPushToken[test-token]',
      platform: 'ios'
    }

    it('should register a new device successfully', async () => {
      const response = await request(app)
        .post('/user/register')
        .send(validPayload)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message', 'Device registered successfully')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user).toHaveProperty('deviceId', validPayload.deviceId)
      expect(response.body.user).toHaveProperty('expoPushToken', validPayload.expoPushToken)
      expect(response.body.user).toHaveProperty('platform', validPayload.platform)
      expect(response.body.user).toHaveProperty('shouldReceiveNotifications', true)
      expect(response.body.user).toHaveProperty('registeredAt')
    })

    it('should return existing user when device is already registered', async () => {
      // Register device first time
      const firstResponse = await request(app)
        .post('/user/register')
        .send(validPayload)

      // Register same device again
      const secondResponse = await request(app)
        .post('/user/register')
        .send(validPayload)

      expect(secondResponse.status).toBe(201)
      expect(secondResponse.body.user.id).toBe(firstResponse.body.user.id)
      expect(secondResponse.body.user.registeredAt).toBe(firstResponse.body.user.registeredAt)
    })

    it('should return 400 when deviceId is missing', async () => {
      const invalidPayload = {
        expoPushToken: 'ExponentPushToken[test-token]',
        platform: 'ios'
      }

      const response = await request(app)
        .post('/user/register')
        .send(invalidPayload)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Missing required fields')
    })

    it('should return 400 when expoPushToken is missing', async () => {
      const invalidPayload = {
        deviceId: 'test-device-123',
        platform: 'ios'
      }

      const response = await request(app)
        .post('/user/register')
        .send(invalidPayload)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Missing required fields')
    })

    it('should return 400 when platform is missing', async () => {
      const invalidPayload = {
        deviceId: 'test-device-123',
        expoPushToken: 'ExponentPushToken[test-token]'
      }

      const response = await request(app)
        .post('/user/register')
        .send(invalidPayload)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Missing required fields')
    })

    it('should return 400 when fields are empty strings', async () => {
      const invalidPayload = {
        deviceId: '',
        expoPushToken: 'ExponentPushToken[test-token]',
        platform: 'ios'
      }

      const response = await request(app)
        .post('/user/register')
        .send(invalidPayload)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Missing required fields')
    })
  })

  describe('POST /user/unregister', () => {
    const testPayload: RegisterDevicePayload = {
      deviceId: 'test-device-unregister',
      expoPushToken: 'ExponentPushToken[test-token]',
      platform: 'android'
    }

    it('should unregister an existing device', async () => {
      // First register a device
      await request(app)
        .post('/user/register')
        .send(testPayload)

      // Then unregister it
      const response = await request(app)
        .post('/user/unregister')
        .send({ deviceId: testPayload.deviceId })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Device unregistered successfully')

      // Verify the device is marked as not receiving notifications
      const userResponse = await request(app)
        .get(`/user/device/${testPayload.deviceId}`)

      expect(userResponse.status).toBe(200)
      expect(userResponse.body.shouldReceiveNotifications).toBe(false)
    })

    it('should return 404 when trying to unregister non-existent device', async () => {
      const response = await request(app)
        .post('/user/unregister')
        .send({ deviceId: 'non-existent-device' })

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Device not found or already unregistered')
    })

    it('should return 400 when deviceId is missing', async () => {
      const response = await request(app)
        .post('/user/unregister')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Missing required field: deviceId')
    })

    it('should return 400 when deviceId is empty string', async () => {
      const response = await request(app)
        .post('/user/unregister')
        .send({ deviceId: '' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Missing required field: deviceId')
    })
  })

  describe('GET /user/device/:deviceId', () => {
    const testPayload: RegisterDevicePayload = {
      deviceId: 'test-device-get',
      expoPushToken: 'ExponentPushToken[test-token]',
      platform: 'web'
    }

    it('should return user for existing device', async () => {
      // Register a device first
      await request(app)
        .post('/user/register')
        .send(testPayload)

      const response = await request(app)
        .get(`/user/device/${testPayload.deviceId}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('deviceId', testPayload.deviceId)
      expect(response.body).toHaveProperty('expoPushToken', testPayload.expoPushToken)
      expect(response.body).toHaveProperty('platform', testPayload.platform)
      expect(response.body).toHaveProperty('shouldReceiveNotifications', true)
      expect(response.body).toHaveProperty('registeredAt')
    })

    it('should return 404 for non-existent device', async () => {
      const response = await request(app)
        .get('/user/device/non-existent-device')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'User not found')
    })
  })

  describe('GET /user/all', () => {
    it('should return empty array when no users exist', async () => {
      const response = await request(app).get('/user/all')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return all registered users', async () => {
      const payload1: RegisterDevicePayload = {
        deviceId: 'device-1',
        expoPushToken: 'token-1',
        platform: 'ios'
      }
      const payload2: RegisterDevicePayload = {
        deviceId: 'device-2',
        expoPushToken: 'token-2',
        platform: 'android'
      }

      await request(app).post('/user/register').send(payload1)
      await request(app).post('/user/register').send(payload2)

      const response = await request(app).get('/user/all')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
      expect(response.body.map((u: any) => u.deviceId)).toContain('device-1')
      expect(response.body.map((u: any) => u.deviceId)).toContain('device-2')
    })

    it('should include both active and inactive users', async () => {
      const payload1: RegisterDevicePayload = {
        deviceId: 'active-device',
        expoPushToken: 'token-1',
        platform: 'ios'
      }
      const payload2: RegisterDevicePayload = {
        deviceId: 'inactive-device',
        expoPushToken: 'token-2',
        platform: 'android'
      }

      await request(app).post('/user/register').send(payload1)
      await request(app).post('/user/register').send(payload2)
      
      // Unregister one device
      await request(app).post('/user/unregister').send({ deviceId: 'inactive-device' })

      const response = await request(app).get('/user/all')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
      
      const activeUser = response.body.find((u: any) => u.deviceId === 'active-device')
      const inactiveUser = response.body.find((u: any) => u.deviceId === 'inactive-device')
      
      expect(activeUser.shouldReceiveNotifications).toBe(true)
      expect(inactiveUser.shouldReceiveNotifications).toBe(false)
    })
  })

  describe('GET /user/active', () => {
    it('should return empty array when no active users exist', async () => {
      const response = await request(app).get('/user/active')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return only users with notifications enabled', async () => {
      const payload1: RegisterDevicePayload = {
        deviceId: 'active-device',
        expoPushToken: 'token-1',
        platform: 'ios'
      }
      const payload2: RegisterDevicePayload = {
        deviceId: 'inactive-device',
        expoPushToken: 'token-2',
        platform: 'android'
      }

      await request(app).post('/user/register').send(payload1)
      await request(app).post('/user/register').send(payload2)
      
      // Unregister one device
      await request(app).post('/user/unregister').send({ deviceId: 'inactive-device' })

      const response = await request(app).get('/user/active')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].deviceId).toBe('active-device')
      expect(response.body[0].shouldReceiveNotifications).toBe(true)
    })

    it('should return empty array when all users are unregistered', async () => {
      const payload: RegisterDevicePayload = {
        deviceId: 'test-device',
        expoPushToken: 'token',
        platform: 'ios'
      }

      await request(app).post('/user/register').send(payload)
      await request(app).post('/user/unregister').send({ deviceId: 'test-device' })

      const response = await request(app).get('/user/active')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })
})
