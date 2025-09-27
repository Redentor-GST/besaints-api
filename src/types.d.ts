export interface Phrase {
  id?: number
  text: string
  author: string
  date?: string
}

export interface Saint {
  id?: number
  name: string
  date?: string
  description?: string
}

export interface User {
  id?: number
  deviceId: string
  expoPushToken: string
  platform: string
  registeredAt: number
  shouldReceiveNotifications: boolean
}

export interface RegisterDevicePayload {
  deviceId: string
  expoPushToken: string
  platform: string
}
