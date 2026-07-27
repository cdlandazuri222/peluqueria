import { Employee, EmployeeWithUser } from '../entities/Employee.js'

export interface EmployeeRepository {
  findAll(): Promise<EmployeeWithUser[]>
  findById(id: string): Promise<EmployeeWithUser | null>
  findByUserId(userId: string): Promise<Employee | null>
  findAvailable(): Promise<EmployeeWithUser[]>
  create(userId: string, data: Partial<Employee>): Promise<Employee>
  update(id: string, data: Partial<Employee>): Promise<Employee | null>
  delete(id: string): Promise<boolean>
  getSchedule(employeeId: string): Promise<any[]>
  getBlockedDays(employeeId: string): Promise<any[]>
  getAvailableSlots(employeeId: string, date: string, duration: number): Promise<string[]>
}
