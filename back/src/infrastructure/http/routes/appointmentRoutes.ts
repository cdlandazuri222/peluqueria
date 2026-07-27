import { Router, Response } from 'express'
import { CreateAppointment } from '../../../application/use-cases/appointments/CreateAppointment.js'
import { GetAppointments } from '../../../application/use-cases/appointments/GetAppointments.js'
import { AppointmentRepository } from '../../../domain/ports/AppointmentRepository.js'
import { ServiceRepository } from '../../../domain/ports/ServiceRepository.js'
import { EmployeeRepository } from '../../../domain/ports/EmployeeRepository.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js'

export function createAppointmentRoutes(
  appointmentRepo: AppointmentRepository,
  serviceRepo: ServiceRepository,
  employeeRepo: EmployeeRepository
): Router {
  const router = Router()
  const createAppointment = new CreateAppointment(appointmentRepo, serviceRepo, employeeRepo)
  const getAppointments = new GetAppointments(appointmentRepo)

  // Crear cita (cliente autenticado)
  router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const appointment = await createAppointment.execute({
        clientId: req.user!.id,
        employeeId: req.body.employeeId,
        serviceId: req.body.serviceId,
        date: req.body.date,
        startTime: req.body.startTime,
        notes: req.body.notes,
      })
      res.status(201).json(appointment)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  // Mis citas (cliente)
  router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const appointments = await getAppointments.getByClient(req.user!.id)
      res.json(appointments)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  // Todas las citas (admin)
  router.get('/', authenticate, authorize('admin', 'employee'), async (req: AuthRequest, res: Response) => {
    try {
      const { date, start, end } = req.query
      let appointments
      if (date) {
        appointments = await getAppointments.getByDate(date as string)
      } else if (start && end) {
        appointments = await getAppointments.getByDateRange(start as string, end as string)
      } else {
        appointments = await getAppointments.getAll()
      }
      res.json(appointments)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  })

  // Cambiar estado de cita (admin/employee)
  router.patch('/:id/status', authenticate, authorize('admin', 'employee'), async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body
      const appointment = await appointmentRepo.updateStatus(req.params.id, status)
      if (!appointment) {
        res.status(404).json({ error: 'Cita no encontrada' })
        return
      }
      res.json(appointment)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  // Cancelar cita (cliente puede cancelar la suya)
  router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const appointment = await appointmentRepo.findById(req.params.id)
      if (!appointment) {
        res.status(404).json({ error: 'Cita no encontrada' })
        return
      }
      if (req.user!.role === 'client' && appointment.clientId !== req.user!.id) {
        res.status(403).json({ error: 'No puedes cancelar esta cita' })
        return
      }
      const updated = await appointmentRepo.updateStatus(req.params.id, 'cancelled')
      res.json(updated)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

  return router
}
