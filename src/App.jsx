import { Routes, Route, Navigate } from "react-router-dom";

// Componentes estructurales
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Layout } from "./components/layout/Layout.jsx";
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

// Vistas Privadas (Asesores)
import { Dashboard } from "./pages/Dashboard.jsx";
import { LiveChats } from "./pages/LiveChats.jsx";
import { Calls } from "./pages/Calls.jsx";
import { Clients } from "./pages/Clients.jsx";
import { Advisors } from "./pages/Advisors.jsx";
import { Bots } from "./pages/Bots.jsx";
import { Categories } from "./pages/Categories.jsx";

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

      {/* 🏢 MUNDO PRIVADO (Requiere sesión de asesor o admin) */}
      <Route element={<ProtectedRoute allowedRoles={['asesor', 'admin']} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chats" element={<LiveChats />} />
          <Route path="/llamadas" element={<Calls />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/asesores" element={<Advisors />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/categorias" element={<Categories />} />
        </Route>
      </Route>

      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;