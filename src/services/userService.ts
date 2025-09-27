import { getDatabase } from '../db/db'
import { User, RegisterDevicePayload } from '../types'

export default class UserService {
  registerDevice = (payload: RegisterDevicePayload): User => {
    const db = getDatabase()

    // Check if user already exists
    const existingUser = this.getUserByDeviceId(payload.deviceId)
    if (existingUser !== undefined) {
      // User already exists, return existing user without failing
      return existingUser
    }

    // Create new user
    const registeredAt = Date.now()
    const insertStmt = db.prepare(`
      INSERT INTO users (deviceId, expoPushToken, platform, registeredAt, shouldReceiveNotifications)
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = insertStmt.run(
      payload.deviceId,
      payload.expoPushToken,
      payload.platform,
      registeredAt,
      1
    )

    // Return the created user
    return {
      id: result.lastInsertRowid as number,
      deviceId: payload.deviceId,
      expoPushToken: payload.expoPushToken,
      platform: payload.platform,
      registeredAt,
      shouldReceiveNotifications: true
    }
  }

  unregisterDevice = (deviceId: string): boolean => {
    const db = getDatabase()

    const updateStmt = db.prepare(`
      UPDATE users
      SET shouldReceiveNotifications = 0
      WHERE deviceId = ? AND shouldReceiveNotifications = 1
    `)

    const result = updateStmt.run(deviceId)
    return result.changes > 0
  }

  getUserByDeviceId = (deviceId: string): User | undefined => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM users WHERE deviceId = ?')
    const user = stmt.get(deviceId) as User | undefined

    if (user !== undefined) {
      // Convert SQLite boolean (0/1) to actual boolean
      user.shouldReceiveNotifications = Boolean(user.shouldReceiveNotifications)
    }

    return user
  }

  getAllUsers = (): User[] => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM users ORDER BY registeredAt DESC')
    const users = stmt.all() as User[]

    // Convert SQLite boolean (0/1) to actual boolean for all users
    return users.map(user => ({
      ...user,
      shouldReceiveNotifications: Boolean(user.shouldReceiveNotifications)
    }))
  }

  getActiveUsers = (): User[] => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM users WHERE shouldReceiveNotifications = 1 ORDER BY registeredAt DESC')
    const users = stmt.all() as User[]

    // Convert SQLite boolean (0/1) to actual boolean for all users
    return users.map(user => ({
      ...user,
      shouldReceiveNotifications: Boolean(user.shouldReceiveNotifications)
    }))
  }
}
