import pool from '../database/connection.js'
import { Employee, EmployeeWithUser } from '../../domain/entities/Employee.js'
import { EmployeeRepository } from '../../domain/ports/EmployeeRepository.js'

export class PgEmployeeRepository implements EmployeeRepository {
  private mapRow(row: any): EmployeeWithUser {
    return {
      id: row.id,
      userId: row.user_id,
      specialty: row.specialty,
      bio: row.bio,
      experienceYears: row.experience_years,
      rating: parseFloat(row.rating || '0'),
      totalReviews: row.total_reviews,
      isAvailable: row.is_available,
      createdAt: row.created_at,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      avatarUrl: row.avatar_url,
    }
  }

  private baseQuery = `
    SELECT e.*, u.first_name, u.last_name, u.email, u.phone, u.avatar_url
    FROM employees e
    JOIN users u ON e.user_id = u.id
  `

  async findAll(): Promise<EmployeeWithUser[]> {
    const result = await pool.query(`${this.baseQuery} ORDER BY u.first_name`)
    return result.rows.map(this.mapRow)
  }

  async findById(id: string): Promise<EmployeeWithUser | null> {
    const result = await pool.query(`${this.baseQuery} WHERE e.id = $1`, [id])
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    const result = await pool.query('SELECT * FROM employees WHERE user_id = $1', [userId])
    return result.rows[0] || null
  }

  async findAvailable(): Promise<EmployeeWithUser[]> {
    const result = await pool.query(`${this.baseQuery} WHERE e.is_available = true ORDER BY u.first_name`)
    return result.rows.map(this.mapRow)
  }

  async create(userId: string, data: Partial<Employee>): Promise<Employee> {
    const result = await pool.query(
      `INSERT INTO employees (user_id, specialty, bio, experience_years)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, data.specialty, data.bio, data.experienceYears || 0]
    )
    return result.rows[0]
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (data.specialty !== undefined) { fields.push(`specialty = $${idx++}`); values.push(data.specialty) }
    if (data.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(data.bio) }
    if (data.experienceYears !== undefined) { fields.push(`experience_years = $${idx++}`); values.push(data.experienceYears) }
    if (data.isAvailable !== undefined) { fields.push(`is_available = $${idx++}`); values.push(data.isAvailable) }

    if (fields.length === 0) return null
    values.push(id)

    const result = await pool.query(
      `UPDATE employees SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )
    return result.rows[0] || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM employees WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }

  async getSchedule(employeeId: string) {
    const result = await pool.query(
      'SELECT * FROM schedules WHERE employee_id = $1 AND is_active = true ORDER BY day_of_week',
      [employeeId]
    )
    return result.rows
  }

  async getBlockedDays(employeeId: string) {
    const result = await pool.query(
      'SELECT * FROM blocked_days WHERE employee_id = $1 OR employee_id IS NULL ORDER BY date',
      [employeeId]
    )
    return result.rows
  }

  async getAvailableSlots(employeeId: string, date: string, duration: number): Promise<string[]> {
    const dayOfWeek = new Date(date).getDay()

    // Get schedule for this day
    const scheduleResult = await pool.query(
      'SELECT start_time, end_time FROM schedules WHERE employee_id = $1 AND day_of_week = $2 AND is_active = true',
      [employeeId, dayOfWeek]
    )

    if (scheduleResult.rows.length === 0) return []

    // Check if day is blocked
    const blockedResult = await pool.query(
      'SELECT id FROM blocked_days WHERE (employee_id = $1 OR employee_id IS NULL) AND date = $2',
      [employeeId, date]
    )

    if (blockedResult.rows.length > 0) return []

    const schedule = scheduleResult.rows[0]
    const startMinutes = this.timeToMinutes(schedule.start_time)
    const endMinutes = this.timeToMinutes(schedule.end_time)

    // Get existing appointments
    const appointmentsResult = await pool.query(
      `SELECT start_time, end_time FROM appointments 
       WHERE employee_id = $1 AND date = $2 AND status NOT IN ('cancelled')`,
      [employeeId, date]
    )

    const busy = appointmentsResult.rows.map((r: any) => ({
      start: this.timeToMinutes(r.start_time),
      end: this.timeToMinutes(r.end_time),
    }))

    // Generate available slots
    const slots: string[] = []
    for (let m = startMinutes; m + duration <= endMinutes; m += 30) {
      const slotEnd = m + duration
      const conflict = busy.some(b => m < b.end && slotEnd > b.start)
      if (!conflict) {
        slots.push(this.minutesToTime(m))
      }
    }

    return slots
  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
}
