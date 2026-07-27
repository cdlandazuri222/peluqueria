import { User, CreateUserDTO } from '../entities/User.js'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findByRole(role: string): Promise<User[]>
  create(dto: CreateUserDTO & { passwordHash: string }): Promise<User>
  update(id: string, data: Partial<User>): Promise<User | null>
  delete(id: string): Promise<boolean>
  updateResetToken(id: string, token: string, expires: Date): Promise<void>
  clearResetToken(id: string): Promise<void>
  addLoyaltyPoints(id: string, points: number): Promise<void>
}
