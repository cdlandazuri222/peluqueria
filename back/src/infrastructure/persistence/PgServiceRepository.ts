import pool from '../database/connection.js'
import { Service, CreateServiceDTO } from '../../domain/entities/Service.js'
import { ServiceRepository } from '../../domain/ports/ServiceRepository.js'

export class PgServiceRepository implements ServiceRepository {
  private mapRow(row: any): Service {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      duration: row.duration,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      category: row.category,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async findAll(): Promise<Service[]> {
    const result = await pool.query('SELECT * FROM services ORDER BY category, name')
    return result.rows.map(this.mapRow)
  }

  async findActive(): Promise<Service[]> {
    const result = await pool.query('SELECT * FROM services WHERE is_active = true ORDER BY category, name')
    return result.rows.map(this.mapRow)
  }

  async findById(id: string): Promise<Service | null> {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id])
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async findByCategory(category: string): Promise<Service[]> {
    const result = await pool.query(
      'SELECT * FROM services WHERE category = $1 AND is_active = true ORDER BY name',
      [category]
    )
    return result.rows.map(this.mapRow)
  }

  async create(dto: CreateServiceDTO): Promise<Service> {
    const result = await pool.query(
      `INSERT INTO services (name, description, duration, price, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [dto.name, dto.description, dto.duration, dto.price, dto.imageUrl, dto.category]
    )
    return this.mapRow(result.rows[0])
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name) }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description) }
    if (data.duration !== undefined) { fields.push(`duration = $${idx++}`); values.push(data.duration) }
    if (data.price !== undefined) { fields.push(`price = $${idx++}`); values.push(data.price) }
    if (data.imageUrl !== undefined) { fields.push(`image_url = $${idx++}`); values.push(data.imageUrl) }
    if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category) }
    if (data.isActive !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.isActive) }

    if (fields.length === 0) return this.findById(id)

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const result = await pool.query(
      `UPDATE services SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM services WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }

  async search(query: string): Promise<Service[]> {
    const result = await pool.query(
      `SELECT * FROM services WHERE is_active = true 
       AND (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1)
       ORDER BY name`,
      [`%${query}%`]
    )
    return result.rows.map(this.mapRow)
  }
}
