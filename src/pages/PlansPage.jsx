import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/axios.js';
import './PlansPage.css';

export const PlansPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleStartFlow = async (flowCode) => {
        if (!isAuthenticated) {
            alert('Por favor inicia sesión para contratar un plan.');
            navigate('/login');
            return;
        }

        try {
            const { data: checkData } = await api.get('/chat/session/check');
            if (checkData.hasActive) {
                const confirm = window.confirm("Tienes una sesión de chat activa. Si continúas, se reemplazará por esta nueva solicitud. ¿Deseas continuar?");
                if (!confirm) return;
            }

            const { data: sessionData } = await api.post('/chat/session/flow', { flow: flowCode });
            window.dispatchEvent(new CustomEvent('open-chat', { detail: { sessionId: sessionData.sessionId } }));
        } catch (error) {
            console.error('Error starting flow:', error);
            alert('Hubo un error al iniciar el proceso.');
        }
    };

    return (
        <>
            {/* PAGE HEADER */}
            <div className="page-header-hero">
                <div className="container">
                    <h1>Planes</h1>
                    <div className="breadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Planes</span>
                    </div>
                </div>
            </div>

            {/* ===== TV DTH ===== */}
            <section className="plans-section" id="tv">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Conexión TV DTH</h2>
                        <p className="text-secondary">
                            DTH (Direct-to-Home) la conexión de TV entrega televisión satelital directamente
                            al hogar del espectador vía satélite.
                        </p>
                    </div>
                    <div className="grid grid-3">
                        <div className="price-card">
                            <h3>Básico SD</h3>
                            <div className="price-amount">$19<span>/mes</span></div>
                            <ul className="price-features">
                                <li>50 Canales SD</li>
                                <li>Canales Locales</li>
                                <li>Noticias y Deportes</li>
                                <li>Instalación Gratis</li>
                                <li>Soporte 24/7</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card featured">
                            <h3>Estándar HD</h3>
                            <div className="price-amount">$35<span>/mes</span></div>
                            <ul className="price-features">
                                <li>100 Canales HD</li>
                                <li>Canales Premium</li>
                                <li>Deportes en Vivo</li>
                                <li>Películas y Series</li>
                                <li>Grabación DVR</li>
                                <li>2 Decodificadores</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-primary" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card">
                            <h3>Premium 4K</h3>
                            <div className="price-amount">$55<span>/mes</span></div>
                            <ul className="price-features">
                                <li>150+ Canales 4K</li>
                                <li>Todos los Canales Premium</li>
                                <li>Eventos PPV Incluidos</li>
                                <li>Contenido Internacional</li>
                                <li>DVR Avanzado 500GB</li>
                                <li>3 Decodificadores</li>
                                <li>App Móvil</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BANDA ANCHA ===== */}
            <section className="plans-section plans-alt" id="internet">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Conexión de Banda Ancha</h2>
                        <p className="text-secondary">
                            Internet de alta velocidad siempre activo que permite a los usuarios acceder a la
                            web y transmitir a velocidades rápidas.
                        </p>
                    </div>
                    <div className="grid grid-3">
                        <div className="price-card">
                            <h3>Internet Básico</h3>
                            <div className="price-amount">$29<span>/mes</span></div>
                            <ul className="price-features">
                                <li>Hasta 100 Mbps</li>
                                <li>Ideal para 2-3 dispositivos</li>
                                <li>Streaming HD</li>
                                <li>Router WiFi Gratis</li>
                                <li>Sin límite de datos</li>
                                <li>Instalación Gratis</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card featured">
                            <h3>Internet Rápido</h3>
                            <div className="price-amount">$49<span>/mes</span></div>
                            <ul className="price-features">
                                <li>Hasta 300 Mbps</li>
                                <li>Ideal para 5-7 dispositivos</li>
                                <li>Streaming 4K</li>
                                <li>Gaming Online</li>
                                <li>Router WiFi 5GHz</li>
                                <li>Sin límite de datos</li>
                                <li>Soporte Prioritario</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-primary" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card">
                            <h3>Internet Ultra</h3>
                            <div className="price-amount">$79<span>/mes</span></div>
                            <ul className="price-features">
                                <li>Hasta 500 Mbps</li>
                                <li>Dispositivos ilimitados</li>
                                <li>Streaming 8K</li>
                                <li>Gaming Pro</li>
                                <li>Router WiFi 6 Mesh</li>
                                <li>Sin límite de datos</li>
                                <li>IP Estática Gratis</li>
                                <li>Soporte VIP 24/7</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MÓVIL ===== */}
            <section className="plans-section" id="mobile">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Conexión Móvil</h2>
                        <p className="text-secondary">
                            Planes móviles con llamadas ilimitadas, mensajes de texto y datos móviles para
                            acceso a internet.
                        </p>
                    </div>
                    <div className="grid grid-3">
                        <div className="price-card">
                            <h3>Móvil Básico</h3>
                            <div className="price-amount">$15<span>/mes</span></div>
                            <ul className="price-features">
                                <li>5 GB de Datos</li>
                                <li>Llamadas Ilimitadas</li>
                                <li>SMS Ilimitados</li>
                                <li>4G LTE</li>
                                <li>Sin Contrato</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card featured">
                            <h3>Móvil Plus</h3>
                            <div className="price-amount">$25<span>/mes</span></div>
                            <ul className="price-features">
                                <li>20 GB de Datos</li>
                                <li>Llamadas Ilimitadas</li>
                                <li>SMS Ilimitados</li>
                                <li>5G Incluido</li>
                                <li>Roaming Nacional</li>
                                <li>Hotspot Móvil</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-primary" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card">
                            <h3>Móvil Ilimitado</h3>
                            <div className="price-amount">$40<span>/mes</span></div>
                            <ul className="price-features">
                                <li>Datos Ilimitados</li>
                                <li>Llamadas Ilimitadas</li>
                                <li>SMS Ilimitados</li>
                                <li>5G Ultra</li>
                                <li>Roaming Internacional</li>
                                <li>Hotspot Ilimitado</li>
                                <li>Streaming Premium</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMBOS ===== */}
            <section className="plans-section plans-alt" id="combo">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Paquetes Combo - ¡Ahorra Más!</h2>
                        <p className="text-secondary">Combina nuestros servicios y obtén descuentos exclusivos</p>
                    </div>
                    <div className="grid grid-3">
                        <div className="price-card">
                            <span className="badge" style={{ marginBottom: 'var(--spacing-md)' }}>Ahorra 15%</span>
                            <h3>Combo Doble</h3>
                            <div className="price-amount">$69<span>/mes</span></div>
                            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>Internet + TV</p>
                            <ul className="price-features">
                                <li>Internet 300 Mbps</li>
                                <li>100 Canales HD</li>
                                <li>Router WiFi 5GHz</li>
                                <li>2 Decodificadores</li>
                                <li>Instalación Gratis</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card featured">
                            <span className="badge" style={{ marginBottom: 'var(--spacing-md)' }}>Ahorra 25%</span>
                            <h3>Combo Triple</h3>
                            <div className="price-amount">$99<span>/mes</span></div>
                            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>Internet + TV + Móvil</p>
                            <ul className="price-features">
                                <li>Internet 500 Mbps</li>
                                <li>150 Canales 4K</li>
                                <li>20 GB Datos Móviles</li>
                                <li>Router WiFi 6</li>
                                <li>3 Decodificadores</li>
                                <li>2 Líneas Móviles</li>
                                <li>Soporte VIP</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-primary" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                        <div className="price-card">
                            <span className="badge" style={{ marginBottom: 'var(--spacing-md)' }}>Ahorra 30%</span>
                            <h3>Combo Familiar</h3>
                            <div className="price-amount">$139<span>/mes</span></div>
                            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>Todo Incluido</p>
                            <ul className="price-features">
                                <li>Internet 500 Mbps</li>
                                <li>150+ Canales 4K</li>
                                <li>4 Líneas Móviles Ilimitadas</li>
                                <li>Router WiFi 6 Mesh</li>
                                <li>4 Decodificadores</li>
                                <li>25 OTTs Premium</li>
                                <li>Soporte VIP 24/7</li>
                                <li>Instalación Premium</li>
                            </ul>
                            <button onClick={() => handleStartFlow('inicio_ventas')} className="btn btn-outline" style={{ width: '100%' }}>Contratar Ahora</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
