import bcryptjs from 'bcryptjs'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class ResetPassword {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, code: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    if (!user.resetToken || !user.resetTokenExpires) {
      throw new Error('No se ha solicitado un reseteo de contraseña')
    }

    if (user.resetToken !== code) {
      throw new Error('Código inválido')
    }

    if (new Date() > user.resetTokenExpires) {
      throw new Error('El código ha expirado')
    }

    const passwordHash = await bcryptjs.hash(newPassword, 10)
    await this.userRepo.update(user.id, { passwordHash })
    await this.userRepo.clearResetToken(user.id)
  }
}
