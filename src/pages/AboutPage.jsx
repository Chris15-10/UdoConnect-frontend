import { Link } from 'react-router-dom';
import { useStartFlow } from '../hooks/useStartFlow.js';
import './AboutPage.css';

export const AboutPage = () => {
    const { handleStartFlow } = useStartFlow();
    return (
        <>
            {/* PAGE HEADER */}
            <div className="page-header-hero">
                <div className="container">
                    <h1>Acerca de Nosotros</h1>
                    <div className="breadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Nosotros</span>
                    </div>
                </div>
            </div>

            {/* HISTORIA */}
            <section>
                <div className="container">
                    <div className="about-content">
                        <div>
                            <h2>Nuestra Historia</h2>
                            <p>
                                Desde nuestros inicios, UdoConnect se ha comprometido a revolucionar la forma en
                                que las personas se conectan con el mundo digital. Fundada con la visión de
                                proporcionar servicios de internet y entretenimiento de clase mundial, hemos
                                crecido hasta convertirnos en uno de los proveedores más confiables del mercado.
                            </p>
                            <p>
                                Nuestra misión es simple pero poderosa: conectar a las personas con lo que más
                                importa. Ya sea trabajando desde casa, disfrutando de tu serie favorita o
                                manteniéndote en contacto con seres queridos, estamos aquí para asegurar que tu
                                conexión sea rápida, confiable y asequible.
                            </p>
                        </div>
                        <div>
                            <img
                                src="/images/fiber-optic.png"
                                alt="Tecnología UdoConnect"
                                style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ESTADÍSTICAS */}
            <section className="stats-bg">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>UdoConnect en Números</h2>
                        <p className="text-secondary">Nuestra trayectoria habla por sí misma</p>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">15+</div>
                            <div className="stat-label">Años de Experiencia</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">500K+</div>
                            <div className="stat-label">Clientes Satisfechos</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">99.9%</div>
                            <div className="stat-label">Tiempo de Actividad</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Soporte Técnico</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MISIÓN Y VISIÓN */}
            <section>
                <div className="container">
                    <div className="grid grid-2">
                        <div className="card">
                            <h3 className="card-title">🎯 Nuestra Misión</h3>
                            <p className="card-text">
                                Proporcionar servicios de conectividad y entretenimiento de la más alta calidad,
                                accesibles para todos. Nos esforzamos por innovar constantemente y superar las
                                expectativas de nuestros clientes, ofreciendo soluciones que mejoran su vida
                                diaria y los mantienen conectados con lo que realmente importa.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="card-title">🚀 Nuestra Visión</h3>
                            <p className="card-text">
                                Ser el proveedor líder de servicios de telecomunicaciones en la región, reconocido
                                por nuestra excelencia en servicio al cliente, innovación tecnológica y compromiso
                                con la comunidad. Aspiramos a crear un futuro donde todos tengan acceso a
                                conexiones rápidas y confiables que potencien sus sueños y ambiciones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALORES */}
            <section className="stats-bg">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Nuestros Valores</h2>
                        <p className="text-secondary">Los principios que guían todo lo que hacemos</p>
                    </div>
                    <div className="values-grid">
                        {[
                            { icon: '💎', title: 'Excelencia', desc: 'Nos comprometemos a ofrecer servicios de la más alta calidad en cada interacción.' },
                            { icon: '🤝', title: 'Confianza', desc: 'Construimos relaciones duraderas basadas en la transparencia y la honestidad.' },
                            { icon: '⚡', title: 'Innovación', desc: 'Adoptamos las últimas tecnologías para mantenernos a la vanguardia del sector.' },
                            { icon: '❤️', title: 'Compromiso', desc: 'Estamos dedicados al éxito y satisfacción de nuestros clientes.' },
                            { icon: '🌟', title: 'Accesibilidad', desc: 'Hacemos que la conectividad de calidad sea asequible para todos.' },
                            { icon: '🌍', title: 'Responsabilidad', desc: 'Operamos de manera sostenible y contribuimos positivamente a la comunidad.' },
                        ].map(({ icon, title, desc }) => (
                            <div className="value-card" key={title}>
                                <div className="value-icon">{icon}</div>
                                <h3>{title}</h3>
                                <p className="text-secondary">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section>
                <div className="container text-center">
                    <h2>¿Listo para Unirte a UdoConnect?</h2>
                    <p className="mb-xl text-secondary">
                        Descubre cómo podemos mejorar tu experiencia de conectividad
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)' }}>
                        <Link to="/planes" className="btn btn-primary btn-lg">Ver Planes</Link>
                        <Link to="/contacto" className="btn btn-outline btn-lg">Contáctanos</Link>
                    </div>
                </div>
            </section>
        </>
    );
};
