import { AppointmentWithDetails } from '../../../domain/entities/Appointment.js'
import { AppointmentRepository } from '../../../domain/ports/AppointmentRepository.js'

export class GetAppointments {
  constructor(private appointmentRepo: AppointmentRepository) {}

  async getAll(): Promise<AppointmentWithDetails[]> {
    return this.appointmentRepo.findAll()
  }

  async getByClient(clientId: string): Promise<AppointmentWithDetails[]> {
    return this.appointmentRepo.findByClientId(clientId)
  }

  async getByEmployee(employeeId: string): Promise<AppointmentWithDetails[]> {
    return this.appointmentRepo.findByEmployeeId(employeeId)
  }

  async getByDate(date: string): Promise<AppointmentWithDetails[]> {
    return this.appointmentRepo.findByDate(date)
  }

  async getByDateRange(start: string, end: string): Promise<AppointmentWithDetails[]> {
    return this.appointmentRepo.findByDateRange(start, end)
  }

  async getStats(startDate: string, endDate: string) {
    return this.appointmentRepo.getStats(startDate, endDate)
  }
}
