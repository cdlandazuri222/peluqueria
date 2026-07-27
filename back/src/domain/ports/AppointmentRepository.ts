import { Appointment, CreateAppointmentDTO, AppointmentWithDetails } from '../entities/Appointment.js'

export interface AppointmentRepository {
  findAll(): Promise<AppointmentWithDetails[]>
  findById(id: string): Promise<AppointmentWithDetails | null>
  findByClientId(clientId: string): Promise<AppointmentWithDetails[]>
  findByEmployeeId(employeeId: string): Promise<AppointmentWithDetails[]>
  findByDate(date: string): Promise<AppointmentWithDetails[]>
  findByDateRange(start: string, end: string): Promise<AppointmentWithDetails[]>
  findConflicts(employeeId: string, date: string, startTime: string, endTime: string): Promise<Appointment[]>
  create(dto: CreateAppointmentDTO & { endTime: string; totalPrice: number }): Promise<Appointment>
  updateStatus(id: string, status: Appointment['status']): Promise<Appointment | null>
  update(id: string, data: Partial<Appointment>): Promise<Appointment | null>
  delete(id: string): Promise<boolean>
  getStats(startDate: string, endDate: string): Promise<{
    total: number
    completed: number
    cancelled: number
    revenue: number
  }>
}
