export interface Appointment {
  id: string
  clientId: string
  employeeId: string
  serviceId: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  totalPrice?: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateAppointmentDTO {
  clientId: string
  employeeId: string
  serviceId: string
  date: string
  startTime: string
  notes?: string
}

export interface AppointmentWithDetails extends Appointment {
  clientName?: string
  clientEmail?: string
  employeeName?: string
  serviceName?: string
  serviceDuration?: number
}
