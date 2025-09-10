export interface Class {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  createdAt: string;
}

export interface CreateClassRequest {
  name: string;
  description: string;
  duration: number;
}

export interface Session {
  id: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
  instructor: string;
}

export interface CreateSessionRequest {
  classId: string;
  date: string;
  time: string;
  capacity: number;
  instructor: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  session: Session;
  userId: string;
  bookedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface BookSessionRequest {
  sessionId: string;
}