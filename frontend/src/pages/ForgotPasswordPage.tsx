import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'

type Step = 'email' | 'code' | 'newPassword'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSuccess('Se ha enviado un código a tu email')
      setStep('code')
    } catch (err: any) {
      setError(err.message || 'Error al enviar el código')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos')
      return
    }
    setStep('newPassword')
    setSuccess('')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword(email, code, newPassword)
      setSuccess('¡Contraseña actualizada! Redirigiendo...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl">🔑</span>
          <h1 className="text-2xl font-bold text-dark mt-3">
            {step === 'email' && 'Recuperar contraseña'}
            {step === 'code' && 'Verificar código'}
            {step === 'newPassword' && 'Nueva contraseña'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'email' && 'Ingresa tu email y te enviaremos un código'}
            {step === 'code' && 'Revisa tu bandeja de entrada'}
            {step === 'newPassword' && 'Elige tu nueva contraseña'}
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 w-8 rounded-full transition-all ${step === 'email' ? 'bg-accent' : 'bg-accent/30'}`} />
          <div className={`h-2 w-8 rounded-full transition-all ${step === 'code' ? 'bg-accent' : 'bg-accent/30'}`} />
          <div className={`h-2 w-8 rounded-full transition-all ${step === 'newPassword' ? 'bg-accent' : 'bg-accent/30'}`} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        {/* Paso 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-5">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3.5 rounded-xl font-semibold hover:bg-dark-light transition-all disabled:opacity-50 hover:shadow-lg"
            >
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {/* Paso 2: Código de verificación */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">Código de 6 dígitos</label>
              <input
                id="code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-4 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition text-center text-2xl tracking-[0.5em] font-bold"
                placeholder="000000"
              />
              <p className="text-xs text-gray-400 mt-2">Revisa tu bandeja de entrada y spam</p>
            </div>
            <button
              type="submit"
              disabled={code.length !== 6}
              className="w-full bg-dark text-white py-3.5 rounded-xl font-semibold hover:bg-dark-light transition-all disabled:opacity-50 hover:shadow-lg"
            >
              Verificar código
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setSuccess(''); setError('') }}
              className="w-full text-sm text-gray-500 hover:text-accent transition"
            >
              ← Cambiar email
            </button>
          </form>
        )}

        {/* Paso 3: Nueva contraseña */}
        {step === 'newPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
              <input
                id="confirmNewPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-salon-50 border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition"
                placeholder="Repite la contraseña"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3.5 rounded-xl font-semibold hover:bg-dark-light transition-all disabled:opacity-50 hover:shadow-lg"
            >
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 mt-8 text-sm">
          <Link to="/login" className="text-accent font-semibold hover:underline">
            ← Volver al login
          </Link>
        </p>
      </div>
    </div>
  )
}
