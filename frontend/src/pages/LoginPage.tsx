import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GoogleButton from '../components/GoogleButton'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">✂️</span>
            <h1 className="text-2xl font-bold text-dark mt-3">Bienvenido de vuelta</h1>
            <p className="text-gray-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3.5 rounded-xl font-semibold hover:bg-dark-light transition-all disabled:opacity-50 hover:shadow-lg"
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark to-dark-light" />
        <div className="absolute top-10 right-10 text-[100px] opacity-5 rotate-12">✂️</div>
        <div className="absolute bottom-10 left-10 text-[80px] opacity-5 -rotate-12">💈</div>
        <div className="relative text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Tu espacio de belleza</h2>
          <p className="text-gray-400 max-w-sm">Gestiona tus citas, descubre nuevos servicios y acumula puntos de fidelidad.</p>
        </div>
      </div>
    </div>
  )
}
