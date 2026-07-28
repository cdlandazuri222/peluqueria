import jwt from 'jsonwebtoken'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

interface GoogleUserInfo {
  sub: string
  email: string
  given_name: string
  family_name: string
  picture?: string
}

export class GoogleAuth {
  constructor(private userRepo: UserRepository) {}

  async execute(googleToken: string): Promise<{ token: string; user: any }> {
    // Verificar el token con Google
    const googleUser = await this.verifyGoogleToken(googleToken)

    // Buscar si ya existe el usuario
    let user = await this.userRepo.findByEmail(googleUser.email)

    if (!user) {
      // Crear usuario nuevo
      user = await this.userRepo.create({
        email: googleUser.email,
        password: '', // No usa contraseña
        passwordHash: '', // Login solo por Google
        firstName: googleUser.given_name || '',
        lastName: googleUser.family_name || '',
        role: 'client',
      })

      // Actualizar avatar si viene de Google
      if (googleUser.picture) {
        await this.userRepo.update(user.id, { avatarUrl: googleUser.picture })
      }
    }

    if (!user.isActive) {
      throw new Error('Cuenta desactivada')
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
        avatarUrl: user.avatarUrl || googleUser.picture,
        loyaltyPoints: user.loyaltyPoints,
        preferredLanguage: user.preferredLanguage,
      },
    }
  }

  private async verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
    // Primero intentar como id_token (Google Identity Services credential)
    const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    if (tokenInfoRes.ok) {
      const data = await tokenInfoRes.json()
      return {
        sub: data.sub,
        email: data.email,
        given_name: data.given_name || '',
        family_name: data.family_name || '',
        picture: data.picture,
      }
    }

    // Si no es id_token, intentar como access_token
    const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!userInfoRes.ok) {
      throw new Error('Token de Google inválido')
    }

    return userInfoRes.json()
  }
}
