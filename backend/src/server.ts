import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB, closeDB } from "./config/db";

const PORT = process.env.PORT || 4000;

// Conexión a la DB antes de arrancar el servidor
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("🛑 Cerrando servidor...");
      await closeDB();
      server.close(() => {
        console.log("✅ Servidor cerrado correctamente");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
    process.exit(1);
  });
