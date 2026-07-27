import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { servicesApi } from '../api/services'
import type { Service } from '../types'
import { useAuth } from '../context/AuthContext'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    servicesApi.getAll()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['', ...new Set(services.map((s) => s.category).filter(Boolean))]

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(search.toLowerCase())
    const matchCategory = !activeCategory || s.category === activeCategory
    return matchSearch && matchCategory
  })

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-salon-50 border-b border-salon-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-dark mb-2">Nuestros Servicios</h1>
          <p className="text-gray-500">Encuentra el tratamiento perfecto para ti</p>

          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-salon-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat || 'all'}
                onClick={() => setActiveCategory(cat || '')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-dark text-white shadow-md'
                    : 'bg-white text-gray-600 border border-salon-200 hover:border-salon-400'
                }`}
              >
                {cat || 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg">No se encontraron servicios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl border border-salon-100 overflow-hidden hover:shadow-xl hover:shadow-salon-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-salon-100 to-salon-200 flex items-center justify-center">
                    <span className="text-4xl opacity-50">✂️</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {service.category && (
                      <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    )}
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration} min
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-dark group-hover:text-accent transition-colors">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{service.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-salon-100">
                    <span className="text-2xl font-bold text-dark">
                      {service.price.toFixed(0)}€
                    </span>
                    {user ? (
                      <Link
                        to={`/book?service=${service.id}`}
                        className="bg-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent hover:text-dark transition-all"
                      >
                        Reservar
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="text-sm text-accent font-medium hover:underline"
                      >
                        Iniciar sesión para reservar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
