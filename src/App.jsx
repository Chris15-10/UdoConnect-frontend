import { Routes, Route, Navigate } from "react-router-dom";

// Componentes estructurales
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Layout } from "./components/layout/Layout.jsx";
import { AdminLayout } from "./components/layout/AdminLayout.jsx";
import { PublicLayout } from "./components/layout/PublicLayout.jsx";

// Vistas Públicas
import { HomePage } from "./pages/HomePage.jsx";
import { PlansPage } from "./pages/PlansPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { ArticlePage } from "./pages/ArticlePage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { CustomerSupport } from "./pages/CustomerSupport.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";

// Vistas Privadas (Asesores y Gerentes)
import { LiveChats } from "./pages/LiveChats.jsx";
import { Bots } from "./pages/Bots.jsx";
import { ManagerDashboard } from "./pages/ManagerDashboard.jsx";
import { ManagerClientes } from "./pages/ManagerClientes.jsx";
import { ManagerAsesores } from "./pages/ManagerAsesores.jsx";
import { ManagerPlanes } from "./pages/ManagerPlanes.jsx";

function App() {
  return (
    <Routes>
      {/* 🌍 MUNDO PÚBLICO */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/planes" element={<PlansPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<ArticlePage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Route>

      <Route path="/soporte" element={<CustomerSupport />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* 🏢 MUNDO PRIVADO ASESOR (zona general de trabajo) */}
      <Route element={<ProtectedRoute allowedRoles={['asesor']} />}>
        <Route element={<Layout />}>
          <Route path="/chats" element={<LiveChats />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/" element={<Navigate to="/chats" replace />} />
        </Route>
      </Route>

      {/* 🧑‍💼 PANEL DE GERENTE / ADMIN (solo este rol ve /manager) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/clientes" element={<ManagerClientes />} />
          <Route path="/manager/asesores" element={<ManagerAsesores />} />
          <Route path="/manager/planes" element={<ManagerPlanes />} />
        </Route>
      </Route>

      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;