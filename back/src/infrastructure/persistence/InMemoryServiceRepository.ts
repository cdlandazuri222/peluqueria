import { v4 as uuidv4 } from 'uuid'
import { Service, CreateServiceDTO } from '../../domain/entities/Service.js'
import { ServiceRepository } from '../../domain/ports/ServiceRepository.js'

export class InMemoryServiceRepository implements ServiceRepository {
  private services: Map<string, Service> = new Map()

  constructor() {
    // Seed con servicios de ejemplo
    const seeds: CreateServiceDTO[] = [
      { name: 'Corte de cabello', description: 'Corte clásico o moderno adaptado a tu estilo', duration: 30, price: 15, category: 'Cortes' },
      { name: 'Corte + Lavado', description: 'Incluye lavado, masaje capilar y corte', duration: 45, price: 22, category: 'Cortes' },
      { name: 'Tinte completo', description: 'Coloración completa con productos premium', duration: 90, price: 45, category: 'Color' },
      { name: 'Mechas', description: 'Mechas naturales o de fantasía', duration: 120, price: 60, category: 'Color' },
      { name: 'Balayage', description: 'Técnica de coloración degradada', duration: 150, price: 80, category: 'Color' },
      { name: 'Peinado evento', description: 'Peinado para bodas, comuniones y eventos', duration: 60, price: 35, category: 'Peinados' },
      { name: 'Alisado keratina', description: 'Tratamiento de keratina para pelo liso', duration: 120, price: 90, category: 'Tratamientos' },
      { name: 'Hidratación profunda', description: 'Mascarilla nutritiva y reparadora', duration: 30, price: 20, category: 'Tratamientos' },
      { name: 'Barba', description: 'Recorte y perfilado de barba', duration: 20, price: 10, category: 'Barba' },
      { name: 'Afeitado clásico', description: 'Afeitado a navaja con toalla caliente', duration: 30, price: 18, category: 'Barba' },
    ]

    for (const seed of seeds) {
      const service: Service = {
        id: uuidv4(),
        ...seed,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.services.set(service.id, service)
    }
  }

  async findAll(): Promise<Service[]> {
    return Array.from(this.services.values())
  }

  async findActive(): Promise<Service[]> {
    return Array.from(this.services.values()).filter((s) => s.isActive)
  }

  async findById(id: string): Promise<Service | null> {
    return this.services.get(id) ?? null
  }

  async findByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (s) => s.category?.toLowerCase() === category.toLowerCase() && s.isActive
    )
  }

  async create(dto: CreateServiceDTO): Promise<Service> {
    const service: Service = {
      id: uuidv4(),
      ...dto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.services.set(service.id, service)
    return service
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    const service = this.services.get(id)
    if (!service) return null
    const updated = { ...service, ...data, id, updatedAt: new Date() }
    this.services.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.services.delete(id)
  }

  async search(query: string): Promise<Service[]> {
    const q = query.toLowerCase()
    return Array.from(this.services.values()).filter(
      (s) => s.isActive && (s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q))
    )
  }
}
