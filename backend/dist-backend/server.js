"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = process.env.PORT || 4000;
// Conexión a la DB antes de arrancar el servidor
(0, db_1.connectDB)()
    .then(() => {
    const server = app_1.default.listen(PORT, () => {
        console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
    });
    // Graceful shutdown
    const shutdown = async () => {
        console.log("🛑 Cerrando servidor...");
        await (0, db_1.closeDB)();
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
//# sourceMappingURL=server.js.map