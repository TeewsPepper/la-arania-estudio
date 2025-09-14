// backend/src/types/express.d.ts

import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      role: "admin" | "user";
      horasAcumuladas: number;
    }

    interface User extends UserPayload {} // ⚡ Sobrescribimos Express.User

    interface Request {
      user?: User;
    }
  }
}
