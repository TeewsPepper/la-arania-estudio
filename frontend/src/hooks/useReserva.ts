import { useContext } from "react";
import { ReservasContext } from "../context/ReservaContext";

export const useReserva = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error("useReserva debe usarse dentro de un ReservasProvider");
  }
  return context;
};

