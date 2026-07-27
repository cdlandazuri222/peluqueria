import { v4 as uuidv4 } from 'uuid'
import { Employee, EmployeeWithUser } from '../../domain/entities/Employee.js'
import { EmployeeRepository } from '../../domain/ports/EmployeeRepository.js'

export class InMemoryEmployeeRepository implements EmployeeRepository {
  private employees: Map<string, EmployeeWithUser> = new Map()

  constructor() {
    // Seed con empleados de ejemplo
    const seeds: EmployeeWithUser[] = [
      {
        id: uuidv4(), userId: 'emp-user-1', firstName: 'María', lastName: 'García',
        email: 'maria@peluqueria.com', phone: '+34 611 111 111',
        specialty: 'Coloración y Mechas', bio: 'Especialista en técnicas de color',
        experienceYears: 8, rating: 4.9, totalReviews: 120, isAvailable: true, createdAt: new Date(),
      },
      {
        id: uuidv4(), userId: 'emp-user-2', firstName: 'Carlos', lastName: 'López',
        email: 'carlos@peluqueria.com', phone: '+34 622 222 222',
        specialty: 'Cortes y Barba', bio: 'Barbero y estilista con estilo moderno',
        experienceYears: 5, rating: 4.7, totalReviews: 85, isAvailable: true, createdAt: new Date(),
      },
      {
        id: uuidv4(), userId: 'emp-user-3', firstName: 'Laura', lastName: 'Martínez',
        email: 'laura@peluqueria.com', phone: '+34 633 333 333',
        specialty: 'Tratamientos capilares', bio: 'Experta en keratina y restauración capilar',
        experienceYears: 6, rating: 4.8, totalReviews: 95, isAvailable: true, createdAt: new Date(),
      },
    ]

    for (const emp of seeds) {
      this.employees.set(emp.id, emp)
    }
  }

  async findAll(): Promise<EmployeeWithUser[]> {
    return Array.from(this.employees.values())
  }

  async findById(id: string): Promise<EmployeeWithUser | null> {
    return this.employees.get(id) ?? null
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    return Array.from(this.employees.values()).find((e) => e.userId === userId) ?? null
  }

  async findAvailable(): Promise<EmployeeWithUser[]> {
    return Array.from(this.employees.values()).filter((e) => e.isAvailable)
  }

  async create(userId: string, data: Partial<Employee>): Promise<Employee> {
    const emp: EmployeeWithUser = {
      id: uuidv4(),
      userId,
      firstName: '', lastName: '', email: '',
      specialty: data.specialty,
      bio: data.bio,
      experienceYears: data.experienceYears || 0,
      rating: 0,
      totalReviews: 0,
      isAvailable: true,
      createdAt: new Date(),
    }
    this.employees.set(emp.id, emp)
    return emp
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    const emp = this.employees.get(id)
    if (!emp) return null
    const updated = { ...emp, ...data, id }
    this.employees.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.employees.delete(id)
  }

  async getSchedule(_employeeId: string): Promise<any[]> {
    return []
  }

  async getBlockedDays(_employeeId: string): Promise<any[]> {
    return []
  }

  async getAvailableSlots(_employeeId: string, _date: string, _duration: number): Promise<string[]> {
    return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00']
  }
}
