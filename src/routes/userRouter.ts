import { Router } from 'express'
import UserService from '../services/userService'
import { RegisterDevicePayload } from '../types'

const router = Router()
const userService = new UserService()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to user router')
})

// Register a device
router.post('/register', (req, res) => {
  try {
    const payload: RegisterDevicePayload = req.body
    console.log({ payload })

    // Validate required fields
    if (payload.deviceId === undefined || payload.deviceId === '' ||
        payload.expoPushToken === undefined || payload.expoPushToken === '' ||
        payload.platform === undefined || payload.platform === '') {
      return res.status(400).json({
        error: 'Missing required fields: deviceId, expoPushToken, and platform are required'
      })
    }

    const user = userService.registerDevice(payload)
    return res.status(201).json({
      message: 'Device registered successfully',
      user
    })
  } catch (error) {
    console.error('Error registering device:', error)
    return res.status(500).json({ error: 'Failed to register device' })
  }
})

// Unregister a device (disable notifications)
router.post('/unregister', (req, res) => {
  try {
    const { deviceId } = req.body

    if (deviceId === undefined || deviceId === '') {
      return res.status(400).json({
        error: 'Missing required field: deviceId'
      })
    }

    const success = userService.unregisterDevice(deviceId)

    if (!success) {
      return res.status(404).json({
        error: 'Device not found or already unregistered'
      })
    }

    return res.json({
      message: 'Device unregistered successfully'
    })
  } catch (error) {
    console.error('Error unregistering device:', error)
    return res.status(500).json({ error: 'Failed to unregister device' })
  }
})

// Get user by device ID
router.get('/device/:deviceId', (req, res) => {
  try {
    const { deviceId } = req.params
    const user = userService.getUserByDeviceId(deviceId)

    if (user === undefined) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Get all users (for admin purposes)
router.get('/all', (req, res) => {
  try {
    const users = userService.getAllUsers()
    return res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get active users (those who should receive notifications)
router.get('/active', (req, res) => {
  try {
    const users = userService.getActiveUsers()
    return res.json(users)
  } catch (error) {
    console.error('Error fetching active users:', error)
    return res.status(500).json({ error: 'Failed to fetch active users' })
  }
})
