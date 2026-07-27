import { api } from './client'
import type { Appointment } from '../types'

export const appointmentsApi = {
  getMy: () => api.get<Appointment[]>('/appointments/my'),

  create: (data: {
    employeeId: string
    serviceId: string
    date: string
    startTime: string
    notes?: string
  }) => api.post<Appointment>('/appointments', data),

  cancel: (id: string) => api.patch<Appointment>(`/appointments/${id}/cancel`, {}),
}
