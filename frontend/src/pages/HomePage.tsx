import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark text-white min-h-[85vh] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-[200px]">✂️</div>
          <div className="absolute bottom-20 right-10 text-[150px] rotate-45">💈</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              ✨ Reserva online 24/7
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Tu mejor
              <br />
              <span className="text-accent">versión</span>
              <br />
              empieza aquí
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-lg">
              Reserva tu cita online, elige el servicio perfecto y déjate consentir por nuestros profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={user ? '/book' : '/register'}
                className="inline-flex items-center justify-center bg-accent text-dark px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-light transition-all hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5"
              >
                {user ? 'Reservar ahora' : 'Empezar ahora'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Ver servicios
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-16 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-accent">500+</p>
                <p className="text-sm text-gray-400">Clientes felices</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">8+</p>
                <p className="text-sm text-gray-400">Años de experiencia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">4.9</p>
                <p className="text-sm text-gray-400">Valoración media</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">Lo que ofrecemos</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              Nuestros Servicios
            </h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              Cada servicio es una experiencia diseñada para realzar tu belleza natural
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✂️', title: 'Cortes', desc: 'Estilos modernos y clásicos para todos. Corte personalizado según tu tipo de rostro.', price: 'Desde 15€' },
              { icon: '🎨', title: 'Color', desc: 'Tintes, mechas, balayage y técnicas de vanguardia con productos premium.', price: 'Desde 45€' },
              { icon: '💆', title: 'Tratamientos', desc: 'Keratina, hidratación profunda y cuidado capilar para un pelo radiante.', price: 'Desde 20€' },
            ].map((s) => (
              <div key={s.title} className="group relative bg-salon-50 rounded-2xl p-8 hover:bg-dark hover:text-white transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-x-8 -translate-y-8 group-hover:bg-accent/20 transition-colors" />
                <span className="text-4xl block mb-4 relative">{s.icon}</span>
                <h3 className="text-xl font-bold mb-2 relative">{s.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed mb-4 relative">{s.desc}</p>
                <span className="text-accent font-semibold text-sm relative">{s.price}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center text-dark font-semibold hover:text-accent transition gap-2"
            >
              Ver todos los servicios
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-24 bg-salon-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">Sencillo y rápido</span>
            <h2 className="text-4xl font-bold text-dark mt-3">¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Elige tu servicio', desc: 'Explora nuestro catálogo y selecciona lo que necesitas.' },
              { step: '02', title: 'Reserva tu hora', desc: 'Escoge la fecha y hora que mejor te convenga.' },
              { step: '03', title: 'Disfruta', desc: 'Ven al salón y déjate consentir por nuestros profesionales.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-accent text-dark rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-accent/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center px-4 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Lista para un cambio?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-lg mx-auto">
            Reserva tu cita en segundos y elige el horario que mejor te convenga. Sin llamadas, sin esperas.
          </p>
          <Link
            to={user ? '/book' : '/register'}
            className="inline-flex items-center bg-accent text-dark px-10 py-4 rounded-full font-semibold text-lg hover:bg-accent-light transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
          >
            {user ? 'Reservar cita' : 'Crear mi cuenta gratis'}
          </Link>
        </div>
      </section>
    </div>
  )
}
