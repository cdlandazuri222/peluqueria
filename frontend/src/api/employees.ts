import { api } from './client'
import type { Employee } from '../types'

export const employeesApi = {
  getAll: () => api.get<Employee[]>('/employees'),
}
