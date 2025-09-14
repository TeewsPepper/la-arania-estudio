import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute"; 
import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import Promociones from "./pages/promociones/Promociones";
import Login from "./pages/login/Login";
import PromocionDetalles from "../src/pages/promociones/PromocionDetalles";
import Registro from "./pages/registro/Registro";
import ContactForm from "./pages/contacto/ContactForm";
import Perfil from "./pages/perfil/Perfil";
import HorasAcumuladas from "./pages/perfil/HorasAcumuladas";
import MisReservas from "./pages/perfil/MisReservas";
import NuevaReserva from "./pages/perfil/NuevaReserva";
import Admin from "./pages/admin/Admin";   
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

import "./globals.module.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const handlePostLoginRedirect = async () => {

      

      const searchParams = new URLSearchParams(location.search);
      const authSuccess = searchParams.get('authSuccess');
      const userData = searchParams.get('user');

      // ✅ Opción A: Redirigir usando datos del query string (más rápido)
      if (authSuccess && userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          console.log('✅ Redirigiendo desde backend:', user.role);
          
          if (user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/perfil', { replace: true });
          }
          
          // Limpiar URL
          window.history.replaceState({}, '', '/');
          return;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      // ✅ Opción B: Si no hay query params, verificar si ya está autenticado
      const user = await fetchUser();
      if (user) {
        console.log('✅ Usuario ya logueado, redirigiendo:', user.role);
        navigate(user.role === 'admin' ? '/admin' : '/perfil', { replace: true });
      }
    };

    handlePostLoginRedirect();
  }, [location, navigate, fetchUser]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/contacto" element={<ContactForm />} />
        
        <Route
          path="/promocion-detalles/:id"
          element={
            <ProtectedRoute>
              <PromocionDetalles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/horas"
          element={
            <ProtectedRoute>
              <HorasAcumuladas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/nueva-reserva"
          element={
            <ProtectedRoute>
              <NuevaReserva />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/reservas"
          element={
            <ProtectedRoute>
              <MisReservas />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;