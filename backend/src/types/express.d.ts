import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: "admin" | "user";
      horasAcumuladas: number;
    }

    interface User extends UserPayload {} // ⚡ Sobrescribimos Express.User

    interface Request {
      user?: User;
    }
  }
}
