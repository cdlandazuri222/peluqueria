import { Service, CreateServiceDTO } from '../../../domain/entities/Service.js'
import { ServiceRepository } from '../../../domain/ports/ServiceRepository.js'

export class ManageServices {
  constructor(private serviceRepo: ServiceRepository) {}

  async getAll(): Promise<Service[]> {
    return this.serviceRepo.findAll()
  }

  async getActive(): Promise<Service[]> {
    return this.serviceRepo.findActive()
  }

  async getById(id: string): Promise<Service | null> {
    return this.serviceRepo.findById(id)
  }

  async getByCategory(category: string): Promise<Service[]> {
    return this.serviceRepo.findByCategory(category)
  }

  async search(query: string): Promise<Service[]> {
    return this.serviceRepo.search(query)
  }

  async create(dto: CreateServiceDTO): Promise<Service> {
    return this.serviceRepo.create(dto)
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    return this.serviceRepo.update(id, data)
  }

  async delete(id: string): Promise<boolean> {
    return this.serviceRepo.delete(id)
  }
}
