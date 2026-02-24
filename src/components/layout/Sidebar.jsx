import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/chats", icon: "💬", label: "Chats en Vivo" },
  { to: "/llamadas", icon: "📞", label: "Llamadas" },
  { to: "/clientes", icon: "👥", label: "Clientes" },
  { to: "/asesores", icon: "👨‍💼", label: "Asesores" },
  { to: "/bots", icon: "🤖", label: "Bots" },
  { to: "/categorias", icon: "🏷️", label: "Categorías" },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Logo UdoConnect */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <img
            src="/images/logo.png"
            alt="UdoConnect"
            className="sidebar-logo-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
          <span className="sidebar-logo-fallback" style={{ display: "none" }}>
            📡
          </span>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">UdoConnect</span>
          <span className="sidebar-brand-subtitle">Panel de Gestión</span>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.nombre?.split(" ")[0]}</span>
            <span className="sidebar-user-role">{user.rol}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " sidebar-link--active" : ""}`
                }
              >
                <span className="sidebar-link-icon">{icon}</span>
                <span className="sidebar-link-label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};