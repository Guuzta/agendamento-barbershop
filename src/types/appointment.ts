export interface Appointment {
  id: number;
  userId: number;
  barberId: number;
  date: Date;
  createdAt: Date;
}

export interface AppointmentBody {
  userId: number;
  barberId: number;
  date: string;
}

export interface GetAppointmentParams {
  id: string;
}

export interface UserId {
  userId: number;
}
