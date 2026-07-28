import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class ForgotPassword {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      // No revelar si el email existe o no (seguridad)
      return
    }

    // Generar código de 6 dígitos
    const code = crypto.randomInt(100000, 999999).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    await this.userRepo.updateResetToken(user.id, code, expires)

    // Enviar email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Peluquería" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Código de recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a2e; text-align: center;">Recuperar contraseña</h2>
          <p style="color: #555;">Hola ${user.firstName},</p>
          <p style="color: #555;">Tu código de verificación es:</p>
          <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed;">${code}</span>
          </div>
          <p style="color: #888; font-size: 14px;">Este código expira en 15 minutos. Si no solicitaste este cambio, ignora este email.</p>
        </div>
      `,
    })
  }
}
