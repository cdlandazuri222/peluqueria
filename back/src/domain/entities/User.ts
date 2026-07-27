export interface User {
  id: string
  email: string
  passwordHash: string
  role: 'client' | 'employee' | 'admin'
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  isActive: boolean
  resetToken?: string
  resetTokenExpires?: Date
  loyaltyPoints: number
  preferredLanguage: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: 'client' | 'employee' | 'admin'
}

export interface LoginDTO {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  loyaltyPoints: number
  preferredLanguage: string
}
