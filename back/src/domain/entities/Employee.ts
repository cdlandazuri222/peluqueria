export interface Employee {
  id: string
  userId: string
  specialty?: string
  bio?: string
  experienceYears: number
  rating: number
  totalReviews: number
  isAvailable: boolean
  createdAt: Date
}

export interface EmployeeWithUser extends Employee {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
}
