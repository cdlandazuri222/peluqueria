import { Router, Request, Response } from 'express'
import { EmployeeRepository } from '../../../domain/ports/EmployeeRepository.js'

export function createEmployeeRoutes(employeeRepo: EmployeeRepository): Router {
  const router = Router()

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const employees = await employeeRepo.findAvailable()
      res.json(employees)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const employee = await employeeRepo.findById(req.params.id)
      if (!employee) {
        res.status(404).json({ error: 'Empleado no encontrado' })
        return
      }
      res.json(employee)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  return router
}
