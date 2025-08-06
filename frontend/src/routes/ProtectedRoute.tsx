// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'

interface Props {
  isAuthenticated: boolean
  children: React.ReactNode
}

export const ProtectedRoute = ({ isAuthenticated, children }: Props) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}
