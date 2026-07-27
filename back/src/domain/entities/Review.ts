export interface Review {
  id: string
  clientId: string
  employeeId: string
  appointmentId?: string
  rating: number
  comment?: string
  createdAt: Date
}

export interface ReviewWithClient extends Review {
  clientName: string
  clientAvatar?: string
}
