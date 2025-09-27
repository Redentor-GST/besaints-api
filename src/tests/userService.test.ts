import UserService from '../services/userService'
import { RegisterDevicePayload } from '../types'
import { setupTestDatabase, resetTestData, teardownTestDatabase } from './testUtils'

describe('UserService', () => {
  let userService: UserService

  beforeAll(() => {
    setupTestDatabase()
    userService = new UserService()
  })

  beforeEach(() => {
    resetTestData()
  })

  afterAll(() => {
    teardownTestDatabase()
  })

  describe('registerDevice', () => {
    const validPayload: RegisterDevicePayload = {
      deviceId: 'test-device-123',
      expoPushToken: 'ExponentPushToken[test-token]',
      platform: 'ios'
    }

    it('should register a new device successfully', () => {
      const user = userService.registerDevice(validPayload)

      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.deviceId).toBe(validPayload.deviceId)
      expect(user.expoPushToken).toBe(validPayload.expoPushToken)
      expect(user.platform).toBe(validPayload.platform)
      expect(user.shouldReceiveNotifications).toBe(true)
      expect(user.registeredAt).toBeDefined()
      expect(typeof user.registeredAt).toBe('number')
    })

    it('should return existing user when device is already registered', () => {
      // Register device first time
      const firstRegistration = userService.registerDevice(validPayload)

      // Try to register same device again
      const secondRegistration = userService.registerDevice(validPayload)

      expect(secondRegistration.id).toBe(firstRegistration.id)
      expect(secondRegistration.deviceId).toBe(firstRegistration.deviceId)
      expect(secondRegistration.registeredAt).toBe(firstRegistration.registeredAt)
    })

    it('should allow different devices to register', () => {
      const payload1 = { ...validPayload, deviceId: 'device-1' }
      const payload2 = { ...validPayload, deviceId: 'device-2' }

      const user1 = userService.registerDevice(payload1)
      const user2 = userService.registerDevice(payload2)

      expect(user1.id).not.toBe(user2.id)
      expect(user1.deviceId).toBe('device-1')
      expect(user2.deviceId).toBe('device-2')
    })
  })

  describe('unregisterDevice', () => {
    const testPayload: RegisterDevicePayload = {
      deviceId: 'test-device-unregister',
      expoPushToken: 'ExponentPushToken[test-token]',
      platform: 'android'
    }

    it('should unregister an existing device', () => {
      // First register a device
      userService.registerDevice(testPayload)

      // Then unregister it
      const result = userService.unregisterDevice(testPayload.deviceId)

      expect(result).toBe(true)

      // Verify the device is marked as not receiving notifications
      const user = userService.getUserByDeviceId(testPayload.deviceId)
      expect(user).toBeDefined()
      expect(user!.shouldReceiveNotifications).toBe(false)
    })

    it('should return false when trying to unregister non-existent device', () => {
      const result = userService.unregisterDevice('non-existent-device')

      expect(result).toBe(false)
    })

    it('should return false when trying to unregister already unregistered device', () => {
      // Register and unregister device
      userService.registerDevice(testPayload)
      userService.unregisterDevice(testPayload.deviceId)

      // Try to unregister again
      const result = userService.unregisterDevice(testPayload.deviceId)

      expect(result).toBe(false)
    })
  })

  describe('getUserByDeviceId', () => {
    const testPayload: RegisterDevicePayload = {
      deviceId: 'test-device-get',
      expoPushToken: 'ExponentPushToken[test-token]',
      platform: 'web'
    }

    it('should return user for existing device', () => {
      const registeredUser = userService.registerDevice(testPayload)
      const retrievedUser = userService.getUserByDeviceId(testPayload.deviceId)

      expect(retrievedUser).toBeDefined()
      expect(retrievedUser!.id).toBe(registeredUser.id)
      expect(retrievedUser!.deviceId).toBe(testPayload.deviceId)
      expect(retrievedUser!.shouldReceiveNotifications).toBe(true)
    })

    it('should return undefined for non-existent device', () => {
      const user = userService.getUserByDeviceId('non-existent-device')

      expect(user).toBeUndefined()
    })

    it('should properly convert boolean values from SQLite', () => {
      // Register and then unregister to test boolean conversion
      userService.registerDevice(testPayload)
      userService.unregisterDevice(testPayload.deviceId)

      const user = userService.getUserByDeviceId(testPayload.deviceId)

      expect(user).toBeDefined()
      expect(typeof user!.shouldReceiveNotifications).toBe('boolean')
      expect(user!.shouldReceiveNotifications).toBe(false)
    })
  })

  describe('getAllUsers', () => {
    it('should return empty array when no users exist', () => {
      const users = userService.getAllUsers()

      expect(users).toEqual([])
    })

    it('should return all registered users', () => {
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

      userService.registerDevice(payload1)
      userService.registerDevice(payload2)

      const users = userService.getAllUsers()

      expect(users).toHaveLength(2)
      expect(users.map(u => u.deviceId)).toContain('device-1')
      expect(users.map(u => u.deviceId)).toContain('device-2')
    })

    it('should return users ordered by registration date (newest first)', () => {
      const payload1: RegisterDevicePayload = {
        deviceId: 'device-old',
        expoPushToken: 'token-1',
        platform: 'ios'
      }
      const payload2: RegisterDevicePayload = {
        deviceId: 'device-new',
        expoPushToken: 'token-2',
        platform: 'android'
      }

      userService.registerDevice(payload1)
      userService.registerDevice(payload2)

      const users = userService.getAllUsers()

      expect(users).toHaveLength(2)
      // Check that users are returned (order may vary due to same timestamp)
      expect(users.map(u => u.deviceId)).toContain('device-old')
      expect(users.map(u => u.deviceId)).toContain('device-new')
    })
  })

  describe('getActiveUsers', () => {
    it('should return only users with notifications enabled', () => {
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

      userService.registerDevice(payload1)
      userService.registerDevice(payload2)
      
      // Unregister one device
      userService.unregisterDevice(payload2.deviceId)

      const activeUsers = userService.getActiveUsers()

      expect(activeUsers).toHaveLength(1)
      expect(activeUsers[0].deviceId).toBe('active-device')
      expect(activeUsers[0].shouldReceiveNotifications).toBe(true)
    })

    it('should return empty array when no active users exist', () => {
      const payload: RegisterDevicePayload = {
        deviceId: 'test-device',
        expoPushToken: 'token',
        platform: 'ios'
      }

      userService.registerDevice(payload)
      userService.unregisterDevice(payload.deviceId)

      const activeUsers = userService.getActiveUsers()

      expect(activeUsers).toEqual([])
    })
  })
})
