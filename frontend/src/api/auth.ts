import { api } from './client'
import type { AuthResponse, User } from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post<{ id: string; email: string }>('/auth/register', data),

  googleAuth: (token: string) =>
    api.post<AuthResponse>('/auth/google', { token }),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { email, code, newPassword }),

  getMe: () => api.get<User>('/auth/me'),
}
