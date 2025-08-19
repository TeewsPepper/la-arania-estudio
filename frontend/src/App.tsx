// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import Promociones from "./pages/promociones/Promociones";
import Login from "./pages/login/Login";
import "./globals.module.css";
import PromocionDetalles from '../src/pages/promociones/PromocionDetalles';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuth } from './hooks/useAuth';



function App() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/login" element={<Login />} />
          <Route
          path="/promocion-detalles/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PromocionDetalles />
            </ProtectedRoute>
          }
        />
        </Route>
      </Routes>
    </>
  );
}

export default App;
