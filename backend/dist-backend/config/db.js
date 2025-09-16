"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = void 0;
// Expone conexión a MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB conectado");
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("❌ Error MongoDB:", err.message);
        }
        else {
            console.error("❌ Error MongoDB desconocido:", err);
        }
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const closeDB = async () => {
    await mongoose_1.default.connection.close();
    console.log("❎ MongoDB desconectado");
};
exports.closeDB = closeDB;
//# sourceMappingURL=db.js.map