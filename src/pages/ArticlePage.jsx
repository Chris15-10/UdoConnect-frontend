import { useParams, Link } from 'react-router-dom';
import './ArticlePage.css';

const articlesDB = {
    '1': {
        title: '10 Consejos para Optimizar tu Conexión de Internet',
        date: '11 Feb 2026',
        category: 'Consejos',
        image: '/images/blog-1.png',
        content: [
            { type: 'lead', text: 'Una conexión a internet rápida y estable es fundamental hoy en día. Aquí tienes 10 consejos probados para mejorar tu señal y velocidad.' },
            { type: 'h2', text: '1. Ubicación Central del Router' },
            { type: 'p', text: 'El router debe estar en el centro de la casa, elevado y lejos de obstáculos como paredes gruesas o peceras.' },
            { type: 'h2', text: '2. Evita Interferencias' },
            { type: 'p', text: 'Aléjalo de microondas, teléfonos inalámbricos y monitores de bebé que operan en frecuencias similares.' },
            { type: 'h2', text: '3. Usa Cable Ethernet' },
            { type: 'p', text: 'Para dispositivos fijos como PCs o consolas, la conexión por cable siempre será más estable y rápida que el WiFi.' },
            { type: 'h2', text: '4. Actualiza el Firmware' },
            { type: 'p', text: 'Mantén tu router actualizado para asegurar el mejor rendimiento y seguridad.' },
            { type: 'h2', text: '5. Elige la Banda Correcta' },
            { type: 'p', text: 'Usa 5GHz para velocidad en distancias cortas y 2.4GHz para mayor alcance.' },
        ],
    },
    '2': {
        title: 'Guía Completa de Plataformas de Streaming 2026',
        date: '8 Feb 2026',
        category: 'Entretenimiento',
        image: '/images/blog-2.png',
        content: [
            { type: 'lead', text: 'El mercado del streaming es más grande que nunca. Analizamos las mejores opciones para este año.' },
            { type: 'h2', text: 'Netflix: El Rey del Contenido' },
            { type: 'p', text: 'Sigue siendo líder con su inmensa biblioteca de originales y películas.' },
            { type: 'h2', text: 'Disney+: Para la Familia' },
            { type: 'p', text: 'Indispensable si te gustan Marvel, Star Wars o las películas animadas clásicas.' },
            { type: 'h2', text: 'HBO Max: Calidad Premium' },
            { type: 'p', text: 'El hogar de las series más aclamadas por la crítica y estrenos de cine recientes.' },
        ],
    },
    '3': {
        title: '¿Qué es 5G y Cómo Cambiará tu Experiencia Móvil?',
        date: '5 Feb 2026',
        category: 'Tecnología',
        image: '/images/blog-3.png',
        content: [
            { type: 'lead', text: 'El 5G no es solo internet más rápido en tu móvil; es una revolución tecnológica.' },
            { type: 'h2', text: 'Velocidad Ultrarrápida' },
            { type: 'p', text: 'Descarga películas en segundos y disfruta de streaming sin interrupciones en cualquier lugar.' },
            { type: 'h2', text: 'Latencia Casi Nula' },
            { type: 'p', text: 'Ideal para juegos en la nube y aplicaciones en tiempo real como la telemedicina.' },
            { type: 'h2', text: 'Conectividad Masiva' },
            { type: 'p', text: 'Permite conectar miles de dispositivos IoT en un área pequeña sin saturación de red.' },
        ],
    },
    '4': {
        title: 'Fibra Óptica vs Cable: ¿Cuál es Mejor para Ti?',
        date: '2 Feb 2026',
        category: 'Tecnología',
        image: '/images/fiber-optic.png',
        content: [
            { type: 'lead', text: 'Elegir entre fibra y cable coaxial es una duda común. Aquí las comparamos.' },
            { type: 'h2', text: 'Fibra Óptica (FTTH)' },
            { type: 'p', text: 'Utiliza luz para transmitir datos. Ofrece velocidades simétricas y menor latencia. Es la tecnología más moderna y fiable.' },
            { type: 'h2', text: 'Cable Coaxial (HFC)' },
            { type: 'p', text: 'Usa señales eléctricas. Es una tecnología madura pero con velocidades de subida más lentas.' },
        ],
    },
    '5': {
        title: 'Cómo Proteger tu Red WiFi de Intrusos',
        date: '30 Ene 2026',
        category: 'Seguridad',
        image: '/images/mobile.png',
        content: [
            { type: 'lead', text: 'Tu red WiFi es la puerta de entrada a tus datos personales. Protégela con estos pasos.' },
            { type: 'h2', text: 'Cambia la Contraseña por Defecto' },
            { type: 'p', text: 'Nunca uses la contraseña que viene pegada en el router. Crea una frase larga y compleja.' },
            { type: 'h2', text: 'Usa Cifrado WPA3' },
            { type: 'p', text: 'Asegúrate de que tu router esté configurado con el estándar de seguridad más reciente.' },
        ],
    },
    '6': {
        title: 'Cómo Configurar tu Smart TV para Mejor Streaming',
        date: '27 Ene 2026',
        category: 'Guías',
        image: '/images/streaming-tv.png',
        content: [
            { type: 'lead', text: '¿Tienes una tele 4K pero Netflix se ve pixelado? Sigue esta guía.' },
            { type: 'h2', text: 'Usa Cable Ethernet' },
            { type: 'p', text: 'Si es posible, conecta la TV por cable al router en lugar de WiFi para mayor estabilidad.' },
            { type: 'h2', text: 'Activa el Modo Juego/PC' },
            { type: 'p', text: 'Reduce el procesado de imagen innecesario que puede añadir retraso.' },
        ],
    },
};

export const ArticlePage = () => {
    const { id } = useParams();
    const article = articlesDB[id];

    if (!article) {
        return (
            <div style={{ textAlign: 'center', padding: '100px var(--spacing-lg)' }}>
                <h1>Artículo no encontrado</h1>
                <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    El artículo que buscas no existe.
                </p>
                <Link to="/blog" className="btn btn-primary">← Volver al Blog</Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header-hero">
                <div className="container">
                    <h1>{article.title}</h1>
                    <div className="breadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <Link to="/blog">Blog</Link>
                        <span>/</span>
                        <span>Artículo</span>
                    </div>
                </div>
            </div>

            <section>
                <div className="container">
                    <article className="article-container">
                        <div className="article-meta">
                            <span>📅 {article.date}</span>
                            <span>👤 Por Equipo UdoConnect</span>
                            <span>📁 {article.category}</span>
                        </div>

                        <img src={article.image} alt={article.title} className="article-image" />

                        <div className="article-content">
                            {article.content.map((block, i) => {
                                if (block.type === 'lead') return (
                                    <p key={i} className="article-lead">{block.text}</p>
                                );
                                if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
                                if (block.type === 'p') return <p key={i}>{block.text}</p>;
                                return null;
                            })}
                        </div>

                        <div className="share-links">
                            <span>Compartir:</span>
                            <a href="#" className="btn btn-outline btn-sm" onClick={(e) => e.preventDefault()}>Facebook</a>
                            <a href="#" className="btn btn-outline btn-sm" onClick={(e) => e.preventDefault()}>Twitter</a>
                            <a href="#" className="btn btn-outline btn-sm" onClick={(e) => e.preventDefault()}>LinkedIn</a>
                        </div>
                    </article>

                    <div className="text-center mb-4xl">
                        <Link to="/blog" className="btn btn-primary">← Volver al Blog</Link>
                    </div>
                </div>
            </section>
        </>
    );
};
