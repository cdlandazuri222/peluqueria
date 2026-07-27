import { Review, ReviewWithClient } from '../entities/Review.js'

export interface ReviewRepository {
  findByEmployeeId(employeeId: string): Promise<ReviewWithClient[]>
  findByClientId(clientId: string): Promise<Review[]>
  create(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review>
  delete(id: string): Promise<boolean>
}
