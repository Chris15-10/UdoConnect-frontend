import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const streamingPlans = [
  {
    label: 'SD Canales',
    price: '$50',
    features: [
      'Contenido Bajo Demanda',
      'Streaming de Canales en Vivo',
      'Recomendaciones Personalizadas',
      'Planes de Suscripción Flexibles',
    ],
  },
  {
    label: '70 Canales',
    price: '$75',
    features: [
      'Todo del plan SD',
      '70 Canales HD',
      'DVR en la Nube',
      'Acceso Multipantalla',
    ],
  },
  {
    label: '120 Canales',
    price: '$99',
    features: [
      'Todo del plan 70',
      '120 Canales HD/4K',
      'Contenido Internacional',
      'Soporte Prioritario',
    ],
  },
];

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="badge">Oferta Limitada</span>
              <h1>
                Transmite Más Inteligente con nuestro{' '}
                <span className="text-gradient">Entretenimiento Todo-en-Uno</span>
              </h1>

              <div className="hero-features">
                <div className="hero-feature">
                  <div className="hero-feature-icon">📡</div>
                  <div className="hero-feature-text">Hasta 500 Mbps</div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">📺</div>
                  <div className="hero-feature-text">25 OTTs</div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">🎬</div>
                  <div className="hero-feature-text">150+ Canales</div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">📶</div>
                  <div className="hero-feature-text">Router WiFi 5 GHz y TV Box</div>
                </div>
              </div>

              <Link to="/planes" className="btn btn-primary btn-lg">
                Explorar Planes →
              </Link>
            </div>

            <div className="hero-image">
              <div className="hero-price">
                $99
                <span>desde</span>
              </div>
              <img src="/images/hero-person.png" alt="Disfruta del mejor entretenimiento" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SERVICIOS ===================== */}
      <section>
        <div className="container">
          <div className="text-center mb-2xl">
            <h2>Nuestros Servicios</h2>
            <p className="text-secondary">
              Soluciones completas de conectividad y entretenimiento para tu hogar
            </p>
          </div>

          <div className="services-grid">
            <div className="card service-card">
              <div className="card-icon">📡</div>
              <h3 className="card-title">Conexión TV DTH</h3>
              <p className="card-text">
                DTH (Direct-to-Home) la conexión de TV entrega televisión satelital directamente
                al hogar del espectador vía satélite.
              </p>
              <Link to="/planes#tv" className="btn btn-outline">Leer Más →</Link>
            </div>

            <div className="card service-card">
              <div className="card-icon">🌐</div>
              <h3 className="card-title">Conexión de Banda Ancha</h3>
              <p className="card-text">
                Internet de alta velocidad siempre activo que permite a los usuarios acceder a la
                web y transmitir a velocidades rápidas.
              </p>
              <Link to="/planes#internet" className="btn btn-outline">Leer Más →</Link>
            </div>

            <div className="card service-card">
              <div className="card-icon">📱</div>
              <h3 className="card-title">Conexión Móvil</h3>
              <p className="card-text">
                La Conexión Móvil permite a los usuarios acceder a llamadas de voz, mensajes de
                texto (SMS) y datos móviles para acceso a internet.
              </p>
              <Link to="/planes#mobile" className="btn btn-outline">Leer Más →</Link>
            </div>
          </div>

          <div className="text-center mt-2xl">
            <p className="text-accent" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
              Innovador, Confiable y Adaptado para Ti
            </p>
          </div>
        </div>
      </section>

      {/* ===================== INFO SECTION ===================== */}
      <section className="info-section">
        <div className="container">
          <div className="info-content">
            <div className="info-text">
              <h2>Trayendo el Futuro del Internet</h2>
              <p>
                Nuestra tecnología de fibra óptica de última generación ofrece velocidades ultra
                rápidas y conexiones confiables para mantener tu hogar conectado. Experimenta
                streaming sin interrupciones, gaming de baja latencia y descargas instantáneas.
              </p>
              <p>
                Con UdoConnect, obtienes más que solo internet – obtienes una puerta de entrada a
                posibilidades ilimitadas de entretenimiento y productividad.
              </p>
              <Link to="/nosotros" className="btn btn-primary">Conoce Más</Link>
            </div>
            <div className="info-image">
              <img src="/images/fiber-optic.png" alt="Tecnología de fibra óptica" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STREAMING SECTION ===================== */}
      <section className="streaming-section">
        <div className="container">
          <div className="streaming-content">
            <div className="streaming-text">
              <h2>Transmisión en Vivo</h2>
              <p>
                Las plataformas DTH ofrecen servicios de streaming digital que entregan contenido
                de video, como programas de TV, películas, documentales y series web, directamente
                a los usuarios vía internet, evitando métodos tradicionales de cable, satélite o
                transmisión broadcast.
              </p>

              <div className="streaming-tabs">
                {streamingPlans.map((plan, i) => (
                  <button
                    key={i}
                    className={`streaming-tab ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {plan.label}
                  </button>
                ))}
              </div>

              <div className="streaming-price">
                {streamingPlans[activeTab].price}
                <span style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
                  {' '}/Mes
                </span>
              </div>

              <div className="streaming-features">
                {streamingPlans[activeTab].features.map((f, i) => (
                  <div className="streaming-feature" key={i}>{f}</div>
                ))}
              </div>

              <Link to="/planes" className="btn btn-primary btn-lg">Nuestros Planes</Link>
            </div>

            <div className="info-image">
              <img src="/images/streaming-tv.png" alt="Transmisión en vivo" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section>
        <div className="container">
          <div className="text-center mb-2xl">
            <h2>Nuestros Paquetes Económicos</h2>
            <p className="text-secondary">
              Cuando buscas paquetes de internet económicos, muchos proveedores ofrecen planes
              asequibles con diferentes niveles de servicio
            </p>
          </div>

          <div className="grid grid-3">
            <div className="price-card">
              <h3>Básico</h3>
              <div className="price-amount">$29<span>/mes</span></div>
              <ul className="price-features">
                <li>Hasta 100 Mbps</li>
                <li>50 Canales SD</li>
                <li>Router WiFi Gratis</li>
                <li>Soporte 24/7</li>
                <li>Sin Contrato</li>
              </ul>
              <Link to="/contacto?plan=basico" className="btn btn-outline" style={{ width: '100%' }}>
                Seleccionar Plan
              </Link>
            </div>

            <div className="price-card featured">
              <h3>Estándar</h3>
              <div className="price-amount">$49<span>/mes</span></div>
              <ul className="price-features">
                <li>Hasta 300 Mbps</li>
                <li>100 Canales HD</li>
                <li>Router WiFi 5GHz</li>
                <li>15 OTTs Incluidos</li>
                <li>Soporte Prioritario</li>
                <li>TV Box Gratis</li>
              </ul>
              <Link to="/contacto?plan=estandar" className="btn btn-primary" style={{ width: '100%' }}>
                Seleccionar Plan
              </Link>
            </div>

            <div className="price-card">
              <h3>Premium</h3>
              <div className="price-amount">$79<span>/mes</span></div>
              <ul className="price-features">
                <li>Hasta 500 Mbps</li>
                <li>150+ Canales 4K</li>
                <li>Router WiFi 6 Mesh</li>
                <li>25 OTTs Premium</li>
                <li>Soporte VIP 24/7</li>
                <li>2 TV Box Gratis</li>
                <li>Instalación Gratis</li>
              </ul>
              <Link to="/planes" className="btn btn-outline" style={{ width: '100%' }}>
                Seleccionar Plan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};