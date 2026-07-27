import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { appointmentsApi } from '../api/appointments'
import type { Appointment } from '../types'

const statusConfig: Record<string, { text: string; color: string; icon: string }> = {
  pending: { text: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⏳' },
  confirmed: { text: 'Confirmada', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '✓' },
  completed: { text: 'Completada', color: 'bg-green-50 text-green-700 border-green-200', icon: '✓✓' },
  cancelled: { text: 'Cancelada', color: 'bg-red-50 text-red-600 border-red-200', icon: '✗' },
  no_show: { text: 'No asistió', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: '—' },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appointmentsApi.getMy()
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) return
    try {
      await appointmentsApi.cancel(id)
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      )
    } catch {
      alert('Error al cancelar la cita')
    }
  }

  const upcoming = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed')
  const past = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no_show')

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-salon-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-salon-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark">Mis Citas</h1>
            <p className="text-gray-500 text-sm mt-1">{appointments.length} cita{appointments.length !== 1 ? 's' : ''} en total</p>
          </div>
          <Link
            to="/book"
            className="bg-dark text-white px-6 py-3 rounded-full font-medium hover:bg-dark-light transition-all hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva cita
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-salon-100">
            <div className="w-20 h-20 bg-salon-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📅</span>
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Sin citas programadas</h2>
            <p className="text-gray-500 mb-6">Reserva tu primera cita y empieza a cuidarte</p>
            <Link
              to="/book"
              className="inline-flex items-center bg-accent text-dark px-6 py-3 rounded-full font-medium hover:bg-accent-light transition"
            >
              Reservar ahora
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Próximas citas</h2>
                <div className="space-y-3">
                  {upcoming.sort((a, b) => a.date.localeCompare(b.date)).map((appointment) => {
                    const status = statusConfig[appointment.status] || statusConfig.pending
                    return (
                      <div
                        key={appointment.id}
                        className="bg-white rounded-xl p-5 border border-salon-100 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-accent uppercase">
                                {new Date(appointment.date + 'T00:00').toLocaleDateString('es-ES', { month: 'short' })}
                              </span>
                              <span className="text-lg font-bold text-dark">
                                {new Date(appointment.date + 'T00:00').getDate()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-dark">
                                {appointment.serviceName || 'Servicio'}
                              </h3>
                              <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                                <p>🕐 {appointment.startTime} - {appointment.endTime}</p>
                                {appointment.employeeName && <p>💇 {appointment.employeeName}</p>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 sm:flex-col sm:items-end">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border ${status.color}`}>
                              {status.icon} {status.text}
                            </span>
                            {appointment.totalPrice && (
                              <span className="text-lg font-bold text-dark">{appointment.totalPrice}€</span>
                            )}
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Historial</h2>
                <div className="space-y-3">
                  {past.sort((a, b) => b.date.localeCompare(a.date)).map((appointment) => {
                    const status = statusConfig[appointment.status] || statusConfig.pending
                    return (
                      <div
                        key={appointment.id}
                        className="bg-white/60 rounded-xl p-5 border border-salon-100"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-salon-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
                              {new Date(appointment.date + 'T00:00').getDate()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-700">{appointment.serviceName || 'Servicio'}</h3>
                              <p className="text-xs text-gray-400">{appointment.date} • {appointment.startTime}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
