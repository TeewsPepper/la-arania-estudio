// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ✅ Agregado
import './index.css' // ✅ Mantiene variables y fuentes
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Envuelve App para habilitar React Router */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)

