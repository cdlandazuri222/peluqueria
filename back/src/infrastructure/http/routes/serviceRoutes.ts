import { Router, Request, Response } from 'express'
import { ManageServices } from '../../../application/use-cases/services/ManageServices.js'
import { ServiceRepository } from '../../../domain/ports/ServiceRepository.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js'

export function createServiceRoutes(serviceRepo: ServiceRepository): Router {
  const router = Router()
  const manageServices = new ManageServices(serviceRepo)

  // Públicas
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const services = await manageServices.getActive()
      res.json(services)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  router.get('/search', async (req: Request, res: Response) => {
    try {
      const { q } = req.query
      if (!q) {
        res.status(400).json({ error: 'Parámetro de búsqueda requerido' })
        return
      }
      const services = await manageServices.search(q as string)
      res.json(services)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  router.get('/category/:category', async (req: Request, res: Response) => {
    try {
      const services = await manageServices.getByCategory(req.params.category)
      res.json(services)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const service = await manageServices.getById(req.params.id)
      if (!service) {
        res.status(404).json({ error: 'Servicio no encontrado' })
        return
      }
      res.json(service)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  // Admin
  router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
      const service = await manageServices.create(req.body)
      res.status(201).json(service)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  router.put('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
      const service = await manageServices.update(req.params.id, req.body)
      if (!service) {
        res.status(404).json({ error: 'Servicio no encontrado' })
        return
      }
      res.json(service)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
      await manageServices.delete(req.params.id)
      res.json({ message: 'Servicio eliminado' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  return router
}
