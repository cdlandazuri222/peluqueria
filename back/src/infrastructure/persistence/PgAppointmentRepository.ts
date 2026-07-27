import pool from '../database/connection.js'
import { Appointment, CreateAppointmentDTO, AppointmentWithDetails } from '../../domain/entities/Appointment.js'
import { AppointmentRepository } from '../../domain/ports/AppointmentRepository.js'

export class PgAppointmentRepository implements AppointmentRepository {
  private mapRow(row: any): Appointment {
    return {
      id: row.id,
      clientId: row.client_id,
      employeeId: row.employee_id,
      serviceId: row.service_id,
      date: row.date,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      notes: row.notes,
      totalPrice: row.total_price ? parseFloat(row.total_price) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  private mapDetailRow(row: any): AppointmentWithDetails {
    return {
      ...this.mapRow(row),
      clientName: row.client_name,
      clientEmail: row.client_email,
      employeeName: row.employee_name,
      serviceName: row.service_name,
      serviceDuration: row.service_duration,
    }
  }

  private detailQuery = `
    SELECT a.*,
      u.first_name || ' ' || u.last_name AS client_name,
      u.email AS client_email,
      eu.first_name || ' ' || eu.last_name AS employee_name,
      s.name AS service_name,
      s.duration AS service_duration
    FROM appointments a
    JOIN users u ON a.client_id = u.id
    JOIN employees e ON a.employee_id = e.id
    JOIN users eu ON e.user_id = eu.id
    JOIN services s ON a.service_id = s.id
  `

  async findAll(): Promise<AppointmentWithDetails[]> {
    const result = await pool.query(`${this.detailQuery} ORDER BY a.date DESC, a.start_time DESC`)
    return result.rows.map((r: any) => this.mapDetailRow(r))
  }

  async findById(id: string): Promise<AppointmentWithDetails | null> {
    const result = await pool.query(`${this.detailQuery} WHERE a.id = $1`, [id])
    return result.rows[0] ? this.mapDetailRow(result.rows[0]) : null
  }

  async findByClientId(clientId: string): Promise<AppointmentWithDetails[]> {
    const result = await pool.query(
      `${this.detailQuery} WHERE a.client_id = $1 ORDER BY a.date DESC, a.start_time DESC`,
      [clientId]
    )
    return result.rows.map((r: any) => this.mapDetailRow(r))
  }

  async findByEmployeeId(employeeId: string): Promise<AppointmentWithDetails[]> {
    const result = await pool.query(
      `${this.detailQuery} WHERE a.employee_id = $1 ORDER BY a.date DESC, a.start_time DESC`,
      [employeeId]
    )
    return result.rows.map((r: any) => this.mapDetailRow(r))
  }

  async findByDate(date: string): Promise<AppointmentWithDetails[]> {
    const result = await pool.query(
      `${this.detailQuery} WHERE a.date = $1 ORDER BY a.start_time`,
      [date]
    )
    return result.rows.map((r: any) => this.mapDetailRow(r))
  }

  async findByDateRange(start: string, end: string): Promise<AppointmentWithDetails[]> {
    const result = await pool.query(
      `${this.detailQuery} WHERE a.date BETWEEN $1 AND $2 ORDER BY a.date, a.start_time`,
      [start, end]
    )
    return result.rows.map((r: any) => this.mapDetailRow(r))
  }

  async findConflicts(employeeId: string, date: string, startTime: string, endTime: string): Promise<Appointment[]> {
    const result = await pool.query(
      `SELECT * FROM appointments 
       WHERE employee_id = $1 AND date = $2 AND status NOT IN ('cancelled')
       AND (start_time < $4 AND end_time > $3)`,
      [employeeId, date, startTime, endTime]
    )
    return result.rows.map((r: any) => this.mapRow(r))
  }

  async create(dto: CreateAppointmentDTO & { endTime: string; totalPrice: number }): Promise<Appointment> {
    const result = await pool.query(
      `INSERT INTO appointments (client_id, employee_id, service_id, date, start_time, end_time, notes, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [dto.clientId, dto.employeeId, dto.serviceId, dto.date, dto.startTime, dto.endTime, dto.notes, dto.totalPrice]
    )
    return this.mapRow(result.rows[0])
  }

  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    const result = await pool.query(
      `UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    )
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (data.date !== undefined) { fields.push(`date = $${idx++}`); values.push(data.date) }
    if (data.startTime !== undefined) { fields.push(`start_time = $${idx++}`); values.push(data.startTime) }
    if (data.endTime !== undefined) { fields.push(`end_time = $${idx++}`); values.push(data.endTime) }
    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status) }
    if (data.notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(data.notes) }

    if (fields.length === 0) return null
    fields.push(`updated_at = NOW()`)
    values.push(id)

    const result = await pool.query(
      `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM appointments WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }

  async getStats(startDate: string, endDate: string) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COALESCE(SUM(total_price) FILTER (WHERE status = 'completed'), 0) as revenue
       FROM appointments
       WHERE date BETWEEN $1 AND $2`,
      [startDate, endDate]
    )
    const row = result.rows[0]
    return {
      total: parseInt(row.total),
      completed: parseInt(row.completed),
      cancelled: parseInt(row.cancelled),
      revenue: parseFloat(row.revenue),
    }
  }
}
