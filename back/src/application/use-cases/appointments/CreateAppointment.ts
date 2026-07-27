import { CreateAppointmentDTO, Appointment } from '../../../domain/entities/Appointment.js'
import { AppointmentRepository } from '../../../domain/ports/AppointmentRepository.js'
import { ServiceRepository } from '../../../domain/ports/ServiceRepository.js'
import { EmployeeRepository } from '../../../domain/ports/EmployeeRepository.js'

export class CreateAppointment {
  constructor(
    private appointmentRepo: AppointmentRepository,
    private serviceRepo: ServiceRepository,
    private employeeRepo: EmployeeRepository
  ) {}

  async execute(dto: CreateAppointmentDTO): Promise<Appointment> {
    // Verificar que el servicio existe
    const service = await this.serviceRepo.findById(dto.serviceId)
    if (!service) {
      throw new Error('Servicio no encontrado')
    }

    // Verificar que el empleado existe
    const employee = await this.employeeRepo.findById(dto.employeeId)
    if (!employee) {
      throw new Error('Empleado no encontrado')
    }

    // Calcular hora de fin
    const [hours, minutes] = dto.startTime.split(':').map(Number)
    const startMinutes = hours * 60 + minutes
    const endMinutes = startMinutes + service.duration
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`

    // Verificar conflictos
    const conflicts = await this.appointmentRepo.findConflicts(
      dto.employeeId,
      dto.date,
      dto.startTime,
      endTime
    )

    if (conflicts.length > 0) {
      throw new Error('El horario seleccionado no está disponible')
    }

    return this.appointmentRepo.create({
      ...dto,
      endTime,
      totalPrice: service.price,
    })
  }
}
