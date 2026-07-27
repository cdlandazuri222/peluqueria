import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { LoginDTO } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class LoginUser {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: LoginDTO): Promise<{ token: string; user: any }> {
    const user = await this.userRepo.findByEmail(dto.email)
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    if (!user.isActive) {
      throw new Error('Cuenta desactivada')
    }

    const validPassword = await bcryptjs.compare(dto.password, user.passwordHash)
    if (!validPassword) {
      throw new Error('Credenciales inválidas')
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        loyaltyPoints: user.loyaltyPoints,
        preferredLanguage: user.preferredLanguage,
      },
    }
  }
}
