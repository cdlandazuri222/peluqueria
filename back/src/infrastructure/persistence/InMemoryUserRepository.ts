import { v4 as uuidv4 } from 'uuid'
import { User, CreateUserDTO } from '../../domain/entities/User.js'
import { UserRepository } from '../../domain/ports/UserRepository.js'

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map()

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find((u) => u.email === email) ?? null
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async findByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter((u) => u.role === role)
  }

  async create(dto: CreateUserDTO & { passwordHash: string }): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: dto.email,
      passwordHash: dto.passwordHash,
      role: dto.role || 'client',
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      isActive: true,
      loyaltyPoints: 0,
      preferredLanguage: 'es',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(user.id, user)
    return user
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null
    const updated = { ...user, ...data, id, updatedAt: new Date() }
    this.users.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id)
  }

  async updateResetToken(id: string, token: string, expires: Date): Promise<void> {
    const user = this.users.get(id)
    if (user) {
      user.resetToken = token
      user.resetTokenExpires = expires
    }
  }

  async clearResetToken(id: string): Promise<void> {
    const user = this.users.get(id)
    if (user) {
      user.resetToken = undefined
      user.resetTokenExpires = undefined
    }
  }

  async addLoyaltyPoints(id: string, points: number): Promise<void> {
    const user = this.users.get(id)
    if (user) {
      user.loyaltyPoints += points
    }
  }
}
