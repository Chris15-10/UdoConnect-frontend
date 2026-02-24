import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { ChatWidget } from '../chat/ChatWidget.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './PublicLayout.css';

export const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    // Cerrar menú de usuario al hacer click fuera
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    // Cerrar menú al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Detectar scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="public-wrapper">

            {/* BARRA SUPERIOR */}
            <div className="header-top">
                <div className="container">
                    <div className="flex-between">
                        <div className="flex gap-lg">
                            <span>📞 +000 124 4152088</span>
                            <span>✉️ info@udoconnect.com</span>
                        </div>
                        <div className="flex gap-lg">
                            <Link to="/planes#ofertas">Oferta de Verano está activa</Link>
                            <Link to="/contacto">Soporte</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* HEADER PRINCIPAL */}
            <header className={`public-header ${isScrolled ? 'scrolled' : ''}`}>
                <nav className="public-nav">

                    {/* Logo */}
                    <Link to="/" onClick={closeMenu}>
                        <img
                            src="/images/logo.png"
                            alt="UdoConnect"
                            className="pub-nav-logo"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                        />
                        <span className="pub-logo-fallback" style={{ display: 'none' }}>
                            <span className="logo-icon">📡</span>
                            <span className="logo-text">UdoConnect</span>
                        </span>
                    </Link>

                    {/* Links de navegación — siempre en fila horizontal */}
                    <ul className={`pub-nav-menu ${isMenuOpen ? 'open' : ''}`}>
                        <li><NavLink to="/" end className="pub-nav-link" onClick={closeMenu}>Inicio</NavLink></li>
                        <li><NavLink to="/planes" className="pub-nav-link" onClick={closeMenu}>Planes</NavLink></li>
                        <li><NavLink to="/nosotros" className="pub-nav-link" onClick={closeMenu}>Nosotros</NavLink></li>
                        <li><NavLink to="/blog" className="pub-nav-link" onClick={closeMenu}>Blog</NavLink></li>
                        <li><NavLink to="/contacto" className="pub-nav-link" onClick={closeMenu}>Contacto</NavLink></li>
                    </ul>

                    {/* Botón CTA + Auth + Toggle Móvil */}
                    <div className="pub-nav-actions">
                        <Link to="/planes" className="btn btn-primary" onClick={closeMenu}>
                            Ver Planes
                        </Link>

                        {/* Auth button */}
                        {isAuthenticated && user ? (
                            <div className="pub-user-menu" ref={userMenuRef}>
                                <button
                                    className="pub-user-btn"
                                    onClick={() => setUserMenuOpen(p => !p)}
                                >
                                    <span className="pub-user-avatar">
                                        {user.nombre?.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="pub-user-name">
                                        {user.nombre?.split(' ')[0]}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▾</span>
                                </button>
                                {userMenuOpen && (
                                    <div className="pub-user-dropdown">
                                        <div className="pub-user-dropdown-info">
                                            <span>{user.nombre}</span>
                                            <small>{user.email || user.username}</small>
                                        </div>
                                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
                                        <button className="pub-user-dropdown-item" onClick={handleLogout}>
                                            🚪 Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="pub-login-btn" onClick={closeMenu}>
                                Iniciar Sesión
                            </Link>
                        )}
                        <button
                            className="pub-nav-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Abrir menú"
                        >
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>

                </nav>
            </header>

            {/* CONTENIDO DE LA PÁGINA */}
            <main>
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <Link to="/">
                                <img
                                    src="/images/logo.png"
                                    alt="UdoConnect"
                                    style={{ height: '50px', marginBottom: 'var(--spacing-lg)' }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </Link>
                            <p className="text-secondary text-sm">
                                Tu proveedor confiable de servicios de internet, televisión y telefonía móvil.
                            </p>
                        </div>

                        <div className="footer-section">
                            <h4>Enlaces Rápidos</h4>
                            <div className="footer-links">
                                <Link to="/">Inicio</Link>
                                <Link to="/planes">Planes</Link>
                                <Link to="/nosotros">Nosotros</Link>
                                <Link to="/blog">Blog</Link>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4>Servicios</h4>
                            <div className="footer-links">
                                <Link to="/planes#internet">Internet de Banda Ancha</Link>
                                <Link to="/planes#tv">TV DTH</Link>
                                <Link to="/planes#mobile">Conexión Móvil</Link>
                                <Link to="/planes#combo">Paquetes Combo</Link>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4>Contacto</h4>
                            <div className="footer-links">
                                <a href="tel:+0001244152088">📞 +000 124 4152088</a>
                                <a href="mailto:info@udoconnect.com">✉️ info@udoconnect.com</a>
                                <Link to="/contacto">📍 Visítanos</Link>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 UdoConnect. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>

            {/* Widget de chat flotante para clientes */}
            <ChatWidget />
        </div>
    );
};