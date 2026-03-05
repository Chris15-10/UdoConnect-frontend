import { useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const POSTS = [
    {
        id: 1,
        image: '/images/blog-1.png',
        date: '11 Feb 2026',
        category: 'Consejos',
        title: '10 Consejos para Optimizar tu Conexión de Internet',
        excerpt:
            'Descubre cómo sacar el máximo provecho de tu conexión de internet con estos consejos prácticos. Desde la ubicación del router hasta la configuración óptima.',
    },
    {
        id: 2,
        image: '/images/blog-2.png',
        date: '8 Feb 2026',
        category: 'Entretenimiento',
        title: 'Guía Completa de Plataformas de Streaming 2026',
        excerpt:
            'Explora las mejores plataformas de streaming disponibles este año. Comparamos precios, contenido y características para ayudarte a elegir.',
    },
    {
        id: 3,
        image: '/images/blog-3.png',
        date: '5 Feb 2026',
        category: 'Tecnología',
        title: '¿Qué es 5G y Cómo Cambiará tu Experiencia Móvil?',
        excerpt:
            'La tecnología 5G está revolucionando las comunicaciones móviles. Aprende cómo esta nueva generación de redes mejorará tu conectividad.',
    },
    {
        id: 4,
        image: '/images/fiber-optic.png',
        date: '2 Feb 2026',
        category: 'Tecnología',
        title: 'Fibra Óptica vs Cable: ¿Cuál es Mejor para Ti?',
        excerpt:
            'Comparamos las dos tecnologías de internet más populares. Descubre las ventajas y desventajas de cada una para tomar la mejor decisión.',
    },
    {
        id: 5,
        image: '/images/mobile.png',
        date: '30 Ene 2026',
        category: 'Seguridad',
        title: 'Cómo Proteger tu Red WiFi de Intrusos',
        excerpt:
            'La seguridad de tu red es fundamental. Aprende las mejores prácticas para mantener tu WiFi seguro y proteger tu información personal.',
    },
    {
        id: 6,
        image: '/images/streaming-tv.png',
        date: '27 Ene 2026',
        category: 'Guías',
        title: 'Cómo Configurar tu Smart TV para Mejor Streaming',
        excerpt:
            'Optimiza tu Smart TV para disfrutar de la mejor calidad de streaming. Configuración paso a paso para una experiencia perfecta.',
    },
];

export const BlogPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [email, setEmail] = useState('');

    const filtered = POSTS.filter(
        (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="page-header-hero">
                <div className="container">
                    <h1>Blog</h1>
                    <div className="breadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Blog</span>
                    </div>
                </div>
            </div>

            <section>
                <div className="container">
                    <div className="blog-container-wrapper">
                        {/* POSTS */}
                        <div>
                            <div className="blog-grid">
                                {filtered.map((post) => (
                                    <article className="blog-card" key={post.id}>
                                        <img src={post.image} alt={post.title} className="blog-image" />
                                        <div className="blog-content">
                                            <div className="blog-meta">
                                                <span>📅 {post.date}</span>
                                                <span>📁 {post.category}</span>
                                            </div>
                                            <h2 className="blog-title">{post.title}</h2>
                                            <p className="blog-excerpt">{post.excerpt}</p>
                                            <Link to={`/blog/${post.id}`} className="btn btn-outline btn-sm">
                                                Leer Más →
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                                {filtered.length === 0 && (
                                    <p className="text-secondary">No se encontraron artículos.</p>
                                )}
                            </div>
                        </div>

                        {/* SIDEBAR */}
                        <aside>
                            <div className="blog-sidebar">
                                <div className="sidebar-section">
                                    <h3>Buscar</h3>
                                    <div className="form-group">
                                        <input
                                            type="search"
                                            className="form-input"
                                            placeholder="Buscar artículos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="sidebar-section">
                                    <h3>Categorías</h3>
                                    <div className="footer-links">
                                        {['Consejos (12)', 'Tecnología (8)', 'Entretenimiento (15)', 'Guías (10)', 'Noticias (20)', 'Seguridad (6)'].map((c) => (
                                            <a href="#" key={c} onClick={(e) => e.preventDefault()}>{c}</a>
                                        ))}
                                    </div>
                                </div>

                                <div className="sidebar-section">
                                    <h3>Publicaciones Recientes</h3>
                                    <div>
                                        {POSTS.slice(0, 4).map((p) => (
                                            <div className="recent-post" key={p.id}>
                                                <Link to={`/blog/${p.id}`}>{p.title}</Link>
                                                <div className="recent-post-date">{p.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="sidebar-section">
                                    <h3>Newsletter</h3>
                                    <p className="text-secondary text-sm mb-md">
                                        Suscríbete para recibir las últimas noticias y ofertas.
                                    </p>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="Tu email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }}>
                                        Suscribirse
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
};
