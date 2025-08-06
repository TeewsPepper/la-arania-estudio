// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Servicio from './pages/Servicio'
import Precios from './pages/Precios'
import Promo from './pages/Promo'
import PromoAcceso from './pages/PromoAcceso'
import Registro from './pages/Registro'
import Login from './pages/Login'
import { ProtectedRoute } from './routes/ProtectedRoute'



function App() {
  const isAuthenticated = false // luego reemplazamos con context o sesión real

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicio/:id" element={<Servicio />} />
        <Route
          path="/precios/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Precios />
            </ProtectedRoute>
          }
        />
        <Route path="/promo" element={<Promo />} />
        <Route
          path="/promo-acceso"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PromoAcceso />
            </ProtectedRoute>
          }
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
    </>
  )
}

export default App


