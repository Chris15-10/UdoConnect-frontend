import { useAuth } from "./context/AuthContext.jsx";
import { Outlet, Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 *
 * Props:
 *   allowedRoles?: string[]  — Si se pasa, solo esos roles pueden entrar.
 *                              Si no se pasa, cualquier usuario autenticado puede entrar.
 *
 * Uso en App.jsx:
 *   <Route element={<ProtectedRoute allowedRoles={['asesor', 'admin']} />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */
export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--color-text-secondary)',
        fontSize: '1.1rem',
        gap: '12px',
      }}>
        <span style={{ fontSize: '1.5rem' }}>⏳</span>
        Verificando sesión...
      </div>
    );
  }

  // No autenticado → ir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero sin el rol correcto → ir al inicio
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};