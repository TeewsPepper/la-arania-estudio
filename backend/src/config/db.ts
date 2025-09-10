// Expone conexión a MongoDB
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB conectado");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Error MongoDB:", err.message);
    } else {
      console.error("❌ Error MongoDB desconocido:", err);
    }
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  console.log("❎ MongoDB desconectado");
};