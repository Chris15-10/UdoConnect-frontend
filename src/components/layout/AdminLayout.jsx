import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./AdminLayout.css";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-circle">
            <span>UA</span>
          </div>
          <div className="admin-brand-text">
            <span className="admin-brand-title">UdoConnect</span>
            <span className="admin-brand-subtitle">Panel Administrativo</span>
          </div>
        </div>

        {user && (
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {user.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">
                {user.nombre || user.username}
              </span>
              <span className="admin-user-role">
                {user.rol === "admin" ? "Administrador" : user.rol}
              </span>
            </div>
          </div>
        )}

        <nav className="admin-menu">
          {[
            { path: '/manager', label: 'Panel de Gerente', icon: '📊', exact: true },
            { path: '/manager/clientes', label: 'Clientes', icon: '👥' },
            { path: '/manager/asesores', label: 'Asesores', icon: '👨‍💼' },
            { path: '/manager/planes', label: 'Planes y Precios', icon: '💲' },
          ].map(({ path, label, icon, exact }) => {
            const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
            return (
              <button
                key={path}
                type="button"
                className={`admin-menu-item${isActive ? ' admin-menu-item--active' : ''}`}
                onClick={() => navigate(path)}
              >
                <span className="admin-menu-icon">{icon}</span>
                <span className="admin-menu-label">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-topbar-title">Panel de Gerente</h1>
            <p className="admin-topbar-subtitle">
              Visión ejecutiva de clientes, deudas, planes y equipo.
            </p>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

