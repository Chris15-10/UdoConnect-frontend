import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, CheckCircle } from 'lucide-react';
import { api } from '../api/axios.js';
import './LoginPage.css'; // Mantenemos el mismo CSS de login para la estructura base

export const RegisterPage = () => {
    const [form, setForm] = useState({
        nombre: '',
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setError('');
        setSuccess('');
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Hacemos la petición directamente con axios configurado
            await api.post('/auth/register', {
                ...form,
                rol: 'cliente' // Por defecto crearemos clientes
            });

            setSuccess('Usuario creado exitosamente. Redirigiendo al login...');

            // Limpiamos el formulario
            setForm({
                nombre: '',
                username: '',
                email: '',
                password: '',
            });

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            const msg = err?.response?.data?.message || 'Error al crear el usuario. Intenta de nuevo.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Panel Izquierdo - Información (Estilo Login) */}
            <div className="login-info">
                <h1>
                    Únete a<br />
                    <span className="text-gradient">Sistema de Gestión</span>
                </h1>
                <p className="login-description">
                    Crea tu cuenta para acceder al panel de control y comenzar a gestionar tus servicios.
                </p>
                <ul className="login-features">
                    <li>
                        <CheckCircle className="feature-icon" size={20} />
                        <span>Soporte prioritario</span>
                    </li>
                    <li>
                        <CheckCircle className="feature-icon" size={20} />
                        <span>Acceso rápido a facturas</span>
                    </li>
                    <li>
                        <CheckCircle className="feature-icon" size={20} />
                        <span>Gestión de servicios</span>
                    </li>
                </ul>
                <div className="login-buttons">
                    <Link to="/nosotros" className="btn btn-outline">Saber más</Link>
                    <Link to="/contacto" className="btn btn-primary">Contactar</Link>
                </div>
            </div>

            {/* Panel Derecho - Formulario (Combinación visual) */}
            <div className="login-form-container">
                <div className="login-form-box" style={{ maxWidth: '450px' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>Crear Cuenta</h2>
                    <p className="text-secondary" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Completa los datos para registrarte
                    </p>

                    {error && (
                        <div className="login-error" style={{ marginBottom: '1rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            ✅ {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Usamos las clases del contact form para los inputs pero mantenemos la estructura visual unificada */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Nombre Completo *</label>
                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Tu nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Email *</label>
                            <div className="input-group">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Nombre de Usuario *</label>
                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Usuario para ingresar"
                                    value={form.username}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Contraseña *</label>
                            <div className="input-group">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
                        </button>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--color-accent-blue)', textDecoration: 'none' }}>Iniciar sesión</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
