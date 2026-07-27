import { api } from './client'
import type { Service } from '../types'

export const servicesApi = {
  getAll: () => api.get<Service[]>('/services'),
  getById: (id: string) => api.get<Service>(`/services/${id}`),
  getByCategory: (category: string) => api.get<Service[]>(`/services/category/${category}`),
  search: (q: string) => api.get<Service[]>(`/services/search?q=${encodeURIComponent(q)}`),
}
