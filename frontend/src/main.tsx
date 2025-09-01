// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';


import './index.css' 
import App from './App.tsx'
import { ReservasProvider } from './context/ReservaContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <ReservasProvider>
        <App /> 
        </ReservasProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

