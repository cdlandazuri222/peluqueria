export interface User {
  id: string
  email: string
  role: 'client' | 'employee' | 'admin'
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  loyaltyPoints: number
  preferredLanguage: string
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  imageUrl?: string
  category?: string
  isActive: boolean
}

export interface Employee {
  id: string
  userId: string
  firstName: string
  lastName: string
  specialty?: string
  bio?: string
  experienceYears: number
  rating: number
  totalReviews: number
  isAvailable: boolean
  avatarUrl?: string
  phone?: string
  email: string
}

export interface Appointment {
  id: string
  clientId: string
  employeeId: string
  serviceId: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  totalPrice?: number
  clientName?: string
  employeeName?: string
  serviceName?: string
  serviceDuration?: number
}

export interface AuthResponse {
  token: string
  user: User
}
