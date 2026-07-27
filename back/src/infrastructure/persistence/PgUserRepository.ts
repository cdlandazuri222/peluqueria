import pool from '../database/connection.js'
import { User, CreateUserDTO } from '../../domain/entities/User.js'
import { UserRepository } from '../../domain/ports/UserRepository.js'

export class PgUserRepository implements UserRepository {
  private mapRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      avatarUrl: row.avatar_url,
      isActive: row.is_active,
      resetToken: row.reset_token,
      resetTokenExpires: row.reset_token_expires,
      loyaltyPoints: row.loyalty_points,
      preferredLanguage: row.preferred_language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC')
    return result.rows.map(this.mapRow)
  }

  async findByRole(role: string): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC', [role])
    return result.rows.map(this.mapRow)
  }

  async create(dto: CreateUserDTO & { passwordHash: string }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [dto.email, dto.passwordHash, dto.role || 'client', dto.firstName, dto.lastName, dto.phone]
    )
    return this.mapRow(result.rows[0])
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (data.firstName !== undefined) { fields.push(`first_name = $${idx++}`); values.push(data.firstName) }
    if (data.lastName !== undefined) { fields.push(`last_name = $${idx++}`); values.push(data.lastName) }
    if (data.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(data.phone) }
    if (data.avatarUrl !== undefined) { fields.push(`avatar_url = $${idx++}`); values.push(data.avatarUrl) }
    if (data.isActive !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.isActive) }
    if (data.preferredLanguage !== undefined) { fields.push(`preferred_language = $${idx++}`); values.push(data.preferredLanguage) }

    if (fields.length === 0) return this.findById(id)

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )
    return result.rows[0] ? this.mapRow(result.rows[0]) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }

  async updateResetToken(id: string, token: string, expires: Date): Promise<void> {
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [token, expires, id]
    )
  }

  async clearResetToken(id: string): Promise<void> {
    await pool.query(
      'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = $1',
      [id]
    )
  }

  async addLoyaltyPoints(id: string, points: number): Promise<void> {
    await pool.query(
      'UPDATE users SET loyalty_points = loyalty_points + $1 WHERE id = $2',
      [points, id]
    )
  }
}
