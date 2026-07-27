import { Service, CreateServiceDTO } from '../entities/Service.js'

export interface ServiceRepository {
  findAll(): Promise<Service[]>
  findActive(): Promise<Service[]>
  findById(id: string): Promise<Service | null>
  findByCategory(category: string): Promise<Service[]>
  create(dto: CreateServiceDTO): Promise<Service>
  update(id: string, data: Partial<Service>): Promise<Service | null>
  delete(id: string): Promise<boolean>
  search(query: string): Promise<Service[]>
}
