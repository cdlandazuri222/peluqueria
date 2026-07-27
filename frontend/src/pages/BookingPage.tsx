import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { servicesApi } from '../api/services'
import { employeesApi } from '../api/employees'
import { appointmentsApi } from '../api/appointments'
import type { Service, Employee } from '../types'

type Step = 1 | 2 | 3 | 4

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [services, setServices] = useState<Service[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('service') || '')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    servicesApi.getAll().then(setServices).catch(() => {})
    employeesApi.getAll().then(setEmployees).catch(() => {})
  }, [])

  // Si viene con servicio preseleccionado, ir al paso 2
  useEffect(() => {
    if (selectedService && services.length > 0) {
      setStep(2)
    }
  }, [selectedService, services])

  const today = new Date().toISOString().split('T')[0]
  const selectedServiceData = services.find((s) => s.id === selectedService)
  const selectedEmployeeData = employees.find((e) => e.id === selectedEmployee)

  const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
  const afternoonSlots = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      await appointmentsApi.create({
        serviceId: selectedService,
        employeeId: selectedEmployee,
        date,
        startTime: time,
        notes: notes || undefined,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cita')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-dark mb-3">¡Cita reservada!</h1>
          <p className="text-gray-500 mb-2">Tu cita ha sido registrada con éxito.</p>
          <div className="bg-salon-50 rounded-xl p-4 my-6 text-left text-sm">
            <p><span className="font-medium">Servicio:</span> {selectedServiceData?.name}</p>
            <p><span className="font-medium">Profesional:</span> {selectedEmployeeData?.firstName} {selectedEmployeeData?.lastName}</p>
            <p><span className="font-medium">Fecha:</span> {new Date(date + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p><span className="font-medium">Hora:</span> {time}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/appointments')}
              className="bg-dark text-white px-6 py-3 rounded-full font-medium hover:bg-dark-light transition"
            >
              Ver mis citas
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-salon-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-salon-50 transition"
            >
              Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s <= step ? 'bg-dark text-white' : 'bg-salon-200 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 mx-1 ${s < step ? 'bg-dark' : 'bg-salon-200'}`} />}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">
            {step === 1 && 'Elige tu servicio'}
            {step === 2 && 'Elige profesional'}
            {step === 3 && 'Selecciona fecha y hora'}
            {step === 4 && 'Confirmar reserva'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => { setSelectedService(service.id); setStep(2) }}
                className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                  selectedService === service.id
                    ? 'border-accent bg-accent/5'
                    : 'border-salon-100 hover:border-salon-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-dark">{service.name}</h3>
                    {service.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{service.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">⏱ {service.duration} min</p>
                  </div>
                  <span className="text-lg font-bold text-accent">{service.price}€</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Employee */}
        {step === 2 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => { setSelectedEmployee(emp.id); setStep(3) }}
                  className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                    selectedEmployee === emp.id
                      ? 'border-accent bg-accent/5'
                      : 'border-salon-100 hover:border-salon-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-salon-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {emp.firstName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{emp.firstName} {emp.lastName}</h3>
                      {emp.specialty && <p className="text-xs text-accent">{emp.specialty}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-500">⭐ {emp.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">• {emp.experienceYears} años exp.</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-500 hover:text-dark transition">
              ← Cambiar servicio
            </button>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">📅 Fecha</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none text-lg"
              />
            </div>

            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">🕐 Mañana</label>
                <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-3 rounded-lg text-sm font-medium transition-all ${
                        time === slot
                          ? 'bg-dark text-white shadow-md'
                          : 'bg-salon-50 text-gray-700 hover:bg-salon-200 border border-salon-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-3 mt-6">🌅 Tarde</label>
                <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-3 rounded-lg text-sm font-medium transition-all ${
                        time === slot
                          ? 'bg-dark text-white shadow-md'
                          : 'bg-salon-50 text-gray-700 hover:bg-salon-200 border border-salon-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-dark transition">
                ← Cambiar profesional
              </button>
            </div>

            {date && time && (
              <button
                onClick={() => setStep(4)}
                className="w-full bg-dark text-white py-4 rounded-xl font-semibold hover:bg-dark-light transition-all"
              >
                Continuar →
              </button>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-salon-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-dark text-lg mb-4">Resumen de tu cita</h3>
              <div className="flex justify-between items-center py-3 border-b border-salon-200">
                <span className="text-gray-500">Servicio</span>
                <span className="font-medium text-dark">{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-salon-200">
                <span className="text-gray-500">Profesional</span>
                <span className="font-medium text-dark">{selectedEmployeeData?.firstName} {selectedEmployeeData?.lastName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-salon-200">
                <span className="text-gray-500">Fecha</span>
                <span className="font-medium text-dark">
                  {new Date(date + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-salon-200">
                <span className="text-gray-500">Hora</span>
                <span className="font-medium text-dark">{time}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-salon-200">
                <span className="text-gray-500">Duración</span>
                <span className="font-medium text-dark">{selectedServiceData?.duration} min</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700 font-semibold">Total</span>
                <span className="text-2xl font-bold text-accent">{selectedServiceData?.price}€</span>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indicaciones especiales, preferencias, alergias..."
                className="w-full px-4 py-3 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 border border-salon-300 text-gray-700 py-4 rounded-xl font-medium hover:bg-salon-50 transition">
                ← Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] bg-accent text-dark py-4 rounded-xl font-bold text-lg hover:bg-accent-light transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-accent/20"
              >
                {loading ? 'Reservando...' : '✓ Confirmar reserva'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
