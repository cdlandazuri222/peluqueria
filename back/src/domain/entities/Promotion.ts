export interface Promotion {
  id: string
  title: string
  description?: string
  discountPercent?: number
  discountAmount?: number
  code?: string
  validFrom: string
  validUntil: string
  isActive: boolean
  maxUses?: number
  currentUses: number
  createdAt: Date
}
