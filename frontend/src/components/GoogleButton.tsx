import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
        }
      }
    }
  }
}

export default function GoogleButton() {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID no configurado')
      return
    }

    // Cargar el script de Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
          locale: 'es',
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup: no removemos el script porque Google no lo soporta bien
    }
  }, [])

  const handleGoogleResponse = async (response: any) => {
    try {
      // Google devuelve un credential (JWT), pero necesitamos un access_token
      // Usamos el credential directamente para verificar en nuestro backend
      // Alternativa: hacer un intercambio por access_token
      // Aquí usamos el approach de enviar el id_token y verificar server-side
      await loginWithGoogle(response.credential)
      navigate('/')
    } catch (error: any) {
      console.error('Error Google auth:', error.message)
    }
  }

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full flex justify-center" />
      {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-400 cursor-not-allowed text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google (no configurado)
        </button>
      )}
    </div>
  )
}
