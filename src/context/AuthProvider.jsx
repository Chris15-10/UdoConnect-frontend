import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { api } from '../api/axios.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // true al inicio para verificar el token guardado

  // Al montar, verificar si hay un token guardado y si todavía es válido
  useEffect(() => {
    const checkStoredToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verificar el token con el backend: GET /api/auth/me
        const { data } = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
        setIsAuthenticated(true);
      } catch {
        // Token inválido o expirado → limpiar
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkStoredToken();
  }, []);

  /**
   * login(username, password)
   * Llama al backend, guarda el token y actualiza el estado.
   * Devuelve el objeto user para que LoginPage pueda redirigir según el rol.
   */
  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });

    localStorage.setItem('token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);

    return data.user; // { id, nombre, username, email, rol }
  };

  /**
   * logout()
   * Limpia el token y resetea el estado.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};