// backend/src/types/index.ts
export interface IUser {
  _id?: string;
  googleId?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt?: Date;
}

export interface IReservation {
  _id?: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  clientNotes?: string;
  adminNotes?: string;
  createdAt?: Date;
}