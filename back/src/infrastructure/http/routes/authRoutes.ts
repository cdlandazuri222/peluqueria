import { Router, Request, Response } from 'express'
import { LoginUser } from '../../../application/use-cases/auth/LoginUser.js'
import { RegisterUser } from '../../../application/use-cases/auth/RegisterUser.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'

export function createAuthRoutes(userRepo: UserRepository): Router {
  const router = Router()
  const loginUser = new LoginUser(userRepo)
  const registerUser = new RegisterUser(userRepo)

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
