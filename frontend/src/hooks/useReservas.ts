
import { useContext } from 'react';
import { ReservasContext } from '../context/ReservasContext';
import type { ReservasContextType } from '../types';

export const useReservas = (): ReservasContextType => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservas debe ser usado dentro de ReservasProvider');
  }
  return context;
};