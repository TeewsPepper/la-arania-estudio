import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import Promociones from "./pages/promociones/Promociones";
import Login from "./pages/login/Login";
import PromocionDetalles from "../src/pages/promociones/PromocionDetalles";
import Registro from "./pages/registro/Registro";
/* import ContactForm from "./pages/contacto/ContactForm"; */
import Perfil from "./pages/perfil/Perfil";
import HorasAcumuladas from "./pages/perfil/HorasAcumuladas";
import MisReservas from "./pages/perfil/MisReservas";
import NuevaReserva from "./pages/perfil/NuevaReserva";
import Admin from "./pages/admin/Admin";
import PrivacyPolicy from "./pages/privacy/PrivacyPolicy";
import AvisoLegal from "./pages/aviso/AvisoLegal";
import "./globals.module.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        {/* <Route path="/contacto" element={<ContactForm />} /> */}
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />

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
