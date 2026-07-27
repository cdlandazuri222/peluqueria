export interface GalleryItem {
  id: string
  employeeId?: string
  title?: string
  description?: string
  imageUrl: string
  beforeImageUrl?: string
  category?: string
  createdAt: Date
}
