export interface Appointment {
  id: number;
  userId: number;
  barberId: number;
  date: Date;
  createdAt: Date;
}

export interface GetAppointmentParams {
  id: string;
}

export interface UserId {
  userId: number;
}
