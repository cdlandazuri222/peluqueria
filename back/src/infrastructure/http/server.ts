import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createAuthRoutes } from './routes/authRoutes.js'
import { createAppointmentRoutes } from './routes/appointmentRoutes.js'
import { createServiceRoutes } from './routes/serviceRoutes.js'
import { createEmployeeRoutes } from './routes/employeeRoutes.js'
import { InMemoryUserRepository } from '../persistence/InMemoryUserRepository.js'
import { InMemoryAppointmentRepository } from '../persistence/InMemoryAppointmentRepository.js'
import { InMemoryServiceRepository } from '../persistence/InMemoryServiceRepository.js'
import { InMemoryEmployeeRepository } from '../persistence/InMemoryEmployeeRepository.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Repositories (InMemory para desarrollo — swap por Pg* para producción)
const userRepo = new InMemoryUserRepository()
const appointmentRepo = new InMemoryAppointmentRepository()
const serviceRepo = new InMemoryServiceRepository()
const employeeRepo = new InMemoryEmployeeRepository()

// Routes
app.use('/api/auth', createAuthRoutes(userRepo))
app.use('/api/appointments', createAppointmentRoutes(appointmentRepo, serviceRepo, employeeRepo))
app.use('/api/services', createServiceRoutes(serviceRepo))
app.use('/api/employees', createEmployeeRoutes(employeeRepo))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
