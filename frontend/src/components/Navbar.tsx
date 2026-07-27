import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `relative px-1 py-2 text-sm font-medium transition-colors ${
      isActive(path) ? 'text-dark' : 'text-gray-500 hover:text-dark'
    }`

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-salon-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="text-xl font-bold tracking-tight text-dark">SALÓN</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass('/')}>
              Inicio
              {isActive('/') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
            </Link>
            <Link to="/services" className={navLinkClass('/services')}>
              Servicios
              {isActive('/services') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
            </Link>
            {user && (
              <Link to="/appointments" className={navLinkClass('/appointments')}>
                Mis Citas
                {isActive('/appointments') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
              </Link>
            )}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/book"
                  className="bg-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-dark-light transition-all hover:shadow-lg"
                >
                  Reservar cita
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border border-salon-200 hover:border-salon-400 transition"
                  >
                    <span className="text-sm text-gray-700">{user.firstName}</span>
                    <span className="w-8 h-8 bg-gradient-to-br from-accent to-salon-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-salon-100 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-salon-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/appointments"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-salon-50"
                      >
                        📅 Mis citas
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-dark transition">
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-dark-light transition-all hover:shadow-lg"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-dark"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-salon-100 animate-fade-in">
            <Link to="/" className="block py-3 px-3 rounded-lg text-gray-700 hover:bg-salon-100" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/services" className="block py-3 px-3 rounded-lg text-gray-700 hover:bg-salon-100" onClick={() => setMenuOpen(false)}>Servicios</Link>
            {user ? (
              <>
                <Link to="/appointments" className="block py-3 px-3 rounded-lg text-gray-700 hover:bg-salon-100" onClick={() => setMenuOpen(false)}>Mis Citas</Link>
                <Link to="/book" className="block py-3 px-3 rounded-lg font-medium text-accent hover:bg-salon-100" onClick={() => setMenuOpen(false)}>Reservar cita</Link>
                <button onClick={handleLogout} className="block w-full text-left py-3 px-3 rounded-lg text-red-600 hover:bg-red-50">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-3 px-3 rounded-lg text-gray-700 hover:bg-salon-100" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
                <Link to="/register" className="block py-3 px-3 rounded-lg font-medium text-dark hover:bg-salon-100" onClick={() => setMenuOpen(false)}>Crear cuenta</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
