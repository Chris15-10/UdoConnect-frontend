import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "./Layout.css"; // Para los estilos estructurales del grid/flex

export const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div id="app-content">
          {/* Aquí se renderizarán las páginas (Dashboard, Chats, etc.) */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};