import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './LoginPage.css';

export const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(''); // Limpiar error al escribir
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await login(credentials.username, credentials.password);

      // Redirigir según el rol
      if (user.rol === 'admin') {
        // Admin → Panel de gerente
        navigate('/manager', { replace: true });
      } else if (user.rol === 'asesor') {
        // Asesor → panel de chats
        navigate('/chats', { replace: true });
      } else {
        // Cliente u otros → vista pública
        navigate('/', { replace: true });
      }
    } catch (err) {
      // Mostrar el mensaje de error del backend si existe
      const msg = err?.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Panel Izquierdo - Información */}
      <div className="login-info">
        <h1>
          Bienvenido a<br />
          <span className="text-gradient">Sistema de Gestión</span>
        </h1>
        <p className="login-description">
          Accede a tu panel de control para administrar clientes, monitorear servicios y gestionar tickets de soporte en tiempo real.
        </p>
        <ul className="login-features">
          <li>
            <CheckCircle className="feature-icon" size={20} />
            <span>Monitoreo de red 24/7</span>
          </li>
          <li>
            <CheckCircle className="feature-icon" size={20} />
            <span>Gestión de usuarios y facturación</span>
          </li>
          <li>
            <CheckCircle className="feature-icon" size={20} />
            <span>Soporte técnico integrado</span>
          </li>
        </ul>
        <div className="login-buttons">
          <Link to="/nosotros" className="btn btn-outline">Saber más</Link>
          <Link to="/contacto" className="btn btn-primary">Contactar</Link>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="login-form-container">
        <div className="login-form-box">
          <h2>Login</h2>

          {/* Mensaje de error */}
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={credentials.username}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Recuérdame</span>
              </label>
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="btn btn-submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              ¿No tienes una cuenta? <Link to="/registro" style={{ color: 'var(--color-accent-blue)', textDecoration: 'none' }}>Regístrate aquí</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};