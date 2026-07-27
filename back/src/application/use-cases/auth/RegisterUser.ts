import bcryptjs from 'bcryptjs'
import { CreateUserDTO, UserResponse } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserResponse> {
    const existing = await this.userRepo.findByEmail(dto.email)
    if (existing) {
      throw new Error('El email ya está registrado')
    }

    const passwordHash = await bcryptjs.hash(dto.password, 10)
    const user = await this.userRepo.create({
      ...dto,
      passwordHash,
      role: dto.role || 'client',
    })

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      loyaltyPoints: user.loyaltyPoints,
      preferredLanguage: user.preferredLanguage,
    }
  }
}
