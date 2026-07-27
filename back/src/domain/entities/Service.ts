export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  imageUrl?: string
  category?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateServiceDTO {
  name: string
  description?: string
  duration: number
  price: number
  imageUrl?: string
  category?: string
}
