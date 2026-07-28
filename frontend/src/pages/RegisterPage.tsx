import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GoogleButton from '../components/GoogleButton'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
      })
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-dark to-dark-light" />
        <div className="absolute top-10 left-10 text-[100px] opacity-5 -rotate-12">✂️</div>
        <div className="absolute bottom-20 right-10 text-[80px] opacity-5 rotate-12">💆</div>
        <div className="relative text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Únete al club</h2>
          <p className="text-gray-400 max-w-sm">Crea tu cuenta gratis y empieza a reservar citas con un solo clic. Acumula puntos con cada visita.</p>
          <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">24/7</p>
              <p className="text-xs text-gray-500">Reserva online</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">0€</p>
              <p className="text-xs text-gray-500">Sin coste extra</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">✂️</span>
            <h1 className="text-2xl font-bold text-dark mt-3">Crear cuenta</h1>
            <p className="text-gray-500 text-sm mt-1">Regístrate y empieza a reservar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Botón de Google */}
          <div className="mb-6">
            <GoogleButton />
          </div>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400">o con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                <input
                  id="firstName"
                  required
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className="w-full px-3 py-2.5 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-gray-600 mb-1">Apellido</label>
                <input
                  id="lastName"
                  required
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className="w-full px-3 py-2.5 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-3 py-2.5 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">Teléfono (opcional)</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-3 py-2.5 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-sm"
                placeholder="+34 612 345 678"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full px-3 py-2.5 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-sm"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 mb-1">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                className="w-full px-3 py-2.5 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3.5 rounded-xl font-semibold hover:bg-dark-light transition-all disabled:opacity-50 hover:shadow-lg mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
