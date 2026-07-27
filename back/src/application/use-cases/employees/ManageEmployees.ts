import { EmployeeWithUser } from '../../../domain/entities/Employee.js'
import { EmployeeRepository } from '../../../domain/ports/EmployeeRepository.js'

export class ManageEmployees {
  constructor(private employeeRepo: EmployeeRepository) {}

  async getAll(): Promise<EmployeeWithUser[]> {
    return this.employeeRepo.findAll()
  }

  async getAvailable(): Promise<EmployeeWithUser[]> {
    return this.employeeRepo.findAvailable()
  }

  async getById(id: string): Promise<EmployeeWithUser | null> {
    return this.employeeRepo.findById(id)
  }

  async getAvailableSlots(employeeId: string, date: string, duration: number): Promise<string[]> {
    return this.employeeRepo.getAvailableSlots(employeeId, date, duration)
  }

  async getSchedule(employeeId: string) {
    return this.employeeRepo.getSchedule(employeeId)
  }
}
