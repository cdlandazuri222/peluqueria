import { Router, Request, Response } from 'express'
import { LoginUser } from '../../../application/use-cases/auth/LoginUser.js'
import { RegisterUser } from '../../../application/use-cases/auth/RegisterUser.js'
import { ForgotPassword } from '../../../application/use-cases/auth/ForgotPassword.js'
import { ResetPassword } from '../../../application/use-cases/auth/ResetPassword.js'
import { GoogleAuth } from '../../../application/use-cases/auth/GoogleAuth.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'

export function createAuthRoutes(userRepo: UserRepository): Router {
  const router = Router()
  const loginUser = new LoginUser(userRepo)
  const registerUser = new RegisterUser(userRepo)
  const forgotPassword = new ForgotPassword(userRepo)
  const resetPassword = new ResetPassword(userRepo)
  const googleAuth = new GoogleAuth(userRepo)

  // Registro con email/password
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ error: 'Todos los campos obligatorios son requeridos' })
        return
      }
      const user = await registerUser.execute({ email, password, firstName, lastName, phone })
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  // Login con email/password
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos' })
        return
      }
      const result = await loginUser.execute({ email, password })
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  })

  // Login/Registro con Google
  router.post('/google', async (req: Request, res: Response) => {
    try {
      const { token } = req.body
      if (!token) {
        res.status(400).json({ error: 'Token de Google requerido' })
        return
      }
      const result = await googleAuth.execute(token)
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  })

  // Olvidé mi contraseña (enviar código por email)
  router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body
      if (!email) {
        res.status(400).json({ error: 'Email es requerido' })
        return
      }
      await forgotPassword.execute(email)
      res.json({ message: 'Si el email existe, se ha enviado un código de verificación' })
    } catch (error: any) {
      res.status(500).json({ error: 'Error al enviar el email' })
    }
  })

  // Resetear contraseña con código
  router.post('/reset-password', async (req: Request, res: Response) => {
    try {
      const { email, code, newPassword } = req.body
      if (!email || !code || !newPassword) {
        res.status(400).json({ error: 'Email, código y nueva contraseña son requeridos' })
        return
      }
      if (newPassword.length < 6) {
        res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
        return
      }
      await resetPassword.execute(email, code, newPassword)
      res.json({ message: 'Contraseña actualizada correctamente' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  // Obtener usuario actual
  router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const user = await userRepo.findById(req.user!.id)
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        loyaltyPoints: user.loyaltyPoints,
        preferredLanguage: user.preferredLanguage,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  return router
}
