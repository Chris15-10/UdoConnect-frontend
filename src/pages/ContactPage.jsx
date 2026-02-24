import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

export const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <div className="page-header-hero">
                <div className="container">
                    <h1>Contáctanos</h1>
                    <div className="breadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Contacto</span>
                    </div>
                </div>
            </div>

            {/* INFO CARDS */}
            <section>
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Estamos Aquí para Ayudarte</h2>
                        <p className="text-secondary">Contáctanos a través de cualquiera de estos medios</p>
                    </div>
                    <div className="contact-grid">
                        <div className="contact-card">
                            <div className="contact-icon">📍</div>
                            <h3>Nuestra Oficina</h3>
                            <p className="text-secondary">
                                Av. Principal 123<br />
                                Centro Empresarial<br />
                                Ciudad, País 12345
                            </p>
                        </div>
                        <div className="contact-card">
                            <div className="contact-icon">📞</div>
                            <h3>Teléfono</h3>
                            <p className="text-secondary">
                                <a href="tel:+0001244152088" style={{ color: 'var(--color-accent-cyan)' }}>
                                    +000 124 4152088
                                </a><br />
                                Lun - Vie: 8:00 AM - 8:00 PM<br />
                                Sáb - Dom: 9:00 AM - 5:00 PM
                            </p>
                        </div>
                        <div className="contact-card">
                            <div className="contact-icon">✉️</div>
                            <h3>Email</h3>
                            <p className="text-secondary">
                                <a href="mailto:info@udoconnect.com" style={{ color: 'var(--color-accent-cyan)' }}>
                                    info@udoconnect.com
                                </a><br />
                                <a href="mailto:soporte@udoconnect.com" style={{ color: 'var(--color-accent-cyan)' }}>
                                    soporte@udoconnect.com
                                </a><br />
                                Respuesta en 24 horas
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FORM SECTION */}
            <section className="contact-form-bg">
                <div className="container">
                    <div className="contact-form-section">
                        <div>
                            <h2>Envíanos un Mensaje</h2>
                            <p className="mb-xl text-secondary">
                                ¿Tienes alguna pregunta o necesitas ayuda? Completa el formulario y nuestro equipo
                                se pondrá en contacto contigo lo antes posible.
                            </p>
                            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <h4 className="card-title">Horarios de Atención</h4>
                                <p className="text-secondary text-sm">
                                    <strong style={{ color: 'var(--color-text-primary)' }}>Lunes a Viernes:</strong> 8:00 AM - 8:00 PM<br />
                                    <strong style={{ color: 'var(--color-text-primary)' }}>Sábados:</strong> 9:00 AM - 5:00 PM<br />
                                    <strong style={{ color: 'var(--color-text-primary)' }}>Domingos:</strong> 9:00 AM - 2:00 PM
                                </p>
                            </div>
                            <div className="card">
                                <h4 className="card-title">Soporte Técnico 24/7</h4>
                                <p className="text-secondary text-sm">
                                    Para emergencias técnicas, nuestro equipo está disponible las 24 horas del día,
                                    los 7 días de la semana.
                                </p>
                                <a href="tel:+0001244152088" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)', display: 'inline-flex' }}>
                                    Llamar Ahora
                                </a>
                            </div>
                        </div>

                        <div className="form-container">
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl) 0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
                                    <h3>¡Mensaje Enviado!</h3>
                                    <p className="text-secondary">Nos pondremos en contacto contigo pronto.</p>
                                    <button
                                        className="btn btn-outline"
                                        style={{ marginTop: 'var(--spacing-lg)' }}
                                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Nombre Completo *</label>
                                        <input type="text" id="name" className="form-input" placeholder="Tu nombre" value={form.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input type="email" id="email" className="form-input" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Teléfono</label>
                                        <input type="tel" id="phone" className="form-input" placeholder="+000 123 456 789" value={form.phone} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject" className="form-label">Asunto *</label>
                                        <select id="subject" className="form-select" value={form.subject} onChange={handleChange} required>
                                            <option value="">Selecciona un asunto</option>
                                            <option value="planes">Consulta sobre Planes</option>
                                            <option value="soporte">Soporte Técnico</option>
                                            <option value="facturacion">Facturación</option>
                                            <option value="ventas">Ventas</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message" className="form-label">Mensaje *</label>
                                        <textarea id="message" className="form-textarea" placeholder="Escribe tu mensaje aquí..." value={form.message} onChange={handleChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                        Enviar Mensaje
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section>
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Preguntas Frecuentes</h2>
                        <p className="text-secondary">Encuentra respuestas rápidas a las preguntas más comunes</p>
                    </div>
                    <div className="grid grid-2">
                        {[
                            {
                                q: '¿Cómo puedo contratar un plan?',
                                a: (
                                    <>Puedes contratar cualquiera de nuestros planes visitando nuestra página de{' '}
                                        <Link to="/planes">Planes</Link>, llamándonos al +000 124 4152088 o visitando nuestra oficina.</>
                                ),
                            },
                            {
                                q: '¿Cuánto tarda la instalación?',
                                a: 'La instalación generalmente se realiza dentro de 24-48 horas después de contratar el servicio, dependiendo de la disponibilidad en tu zona.',
                            },
                            {
                                q: '¿Tienen contratos de permanencia?',
                                a: 'Ofrecemos planes con y sin contrato. Los planes sin contrato te dan total flexibilidad, mientras que los planes con contrato ofrecen descuentos especiales.',
                            },
                            {
                                q: '¿Qué métodos de pago aceptan?',
                                a: 'Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos en efectivo en nuestras oficinas. También ofrecemos débito automático mensual.',
                            },
                        ].map(({ q, a }) => (
                            <div className="card" key={q}>
                                <h4 className="card-title">{q}</h4>
                                <p className="text-secondary text-sm">{a}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-xl">
                        <Link to="/blog" className="btn btn-outline">Ver Más Preguntas</Link>
                    </div>
                </div>
            </section>
        </>
    );
};
