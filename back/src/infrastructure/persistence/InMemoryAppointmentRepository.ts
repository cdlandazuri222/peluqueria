import { v4 as uuidv4 } from 'uuid'
import { Appointment, CreateAppointmentDTO, AppointmentWithDetails } from '../../domain/entities/Appointment.js'
import { AppointmentRepository } from '../../domain/ports/AppointmentRepository.js'

export class InMemoryAppointmentRepository implements AppointmentRepository {
  private appointments: Map<string, Appointment> = new Map()

  async findAll(): Promise<AppointmentWithDetails[]> {
    return Array.from(this.appointments.values()) as AppointmentWithDetails[]
  }

  async findById(id: string): Promise<AppointmentWithDetails | null> {
    return (this.appointments.get(id) as AppointmentWithDetails) ?? null
  }

  async findByClientId(clientId: string): Promise<AppointmentWithDetails[]> {
    return Array.from(this.appointments.values()).filter((a) => a.clientId === clientId) as AppointmentWithDetails[]
  }

  async findByEmployeeId(employeeId: string): Promise<AppointmentWithDetails[]> {
    return Array.from(this.appointments.values()).filter((a) => a.employeeId === employeeId) as AppointmentWithDetails[]
  }

  async findByDate(date: string): Promise<AppointmentWithDetails[]> {
    return Array.from(this.appointments.values()).filter((a) => a.date === date) as AppointmentWithDetails[]
  }

  async findByDateRange(start: string, end: string): Promise<AppointmentWithDetails[]> {
    return Array.from(this.appointments.values()).filter(
      (a) => a.date >= start && a.date <= end
    ) as AppointmentWithDetails[]
  }

  async findConflicts(employeeId: string, date: string, startTime: string, endTime: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (a) =>
        a.employeeId === employeeId &&
        a.date === date &&
        a.status !== 'cancelled' &&
        a.startTime < endTime &&
        a.endTime > startTime
    )
  }

  async create(dto: CreateAppointmentDTO & { endTime: string; totalPrice: number }): Promise<Appointment> {
    const appointment: Appointment = {
      id: uuidv4(),
      clientId: dto.clientId,
      employeeId: dto.employeeId,
      serviceId: dto.serviceId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'pending',
      notes: dto.notes,
      totalPrice: dto.totalPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.appointments.set(appointment.id, appointment)
    return appointment
  }

  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    const appt = this.appointments.get(id)
    if (!appt) return null
    appt.status = status
    appt.updatedAt = new Date()
    return appt
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
    const appt = this.appointments.get(id)
    if (!appt) return null
    const updated = { ...appt, ...data, id, updatedAt: new Date() }
    this.appointments.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.appointments.delete(id)
  }

  async getStats(startDate: string, endDate: string) {
    const inRange = Array.from(this.appointments.values()).filter(
      (a) => a.date >= startDate && a.date <= endDate
    )
    return {
      total: inRange.length,
      completed: inRange.filter((a) => a.status === 'completed').length,
      cancelled: inRange.filter((a) => a.status === 'cancelled').length,
      revenue: inRange.filter((a) => a.status === 'completed').reduce((sum, a) => sum + (a.totalPrice || 0), 0),
    }
  }
}
