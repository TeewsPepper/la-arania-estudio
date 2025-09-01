import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// 👉 Ejemplo: crear reserva
router.post("/", authMiddleware, (req, res) => {
  const user = req.user as any;
  const { fecha, hora } = req.body;

  if (!fecha || !hora) {
    return res.status(400).json({ message: "Fecha y hora requeridas" });
  }

  // Aquí iría la lógica para guardar en la base de datos
  res.json({
    message: "Reserva creada con éxito",
    user: user.email,
    fecha,
    hora,
  });
});

// 👉 Ejemplo: ver reservas del usuario
router.get("/", authMiddleware, (req, res) => {
  const user = req.user as any;

  // Aquí iría la lógica para traer reservas desde DB
  res.json({
    message: "Tus reservas",
    reservas: [
      { id: 1, fecha: "2025-09-05", hora: "18:00", usuario: user.email },
      { id: 2, fecha: "2025-09-10", hora: "20:00", usuario: user.email },
    ],
  });
});

export default router;
