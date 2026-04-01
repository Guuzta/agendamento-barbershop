export interface RegisterBarberBody {
  name: string;
}

export interface Barber {
  id: number;
  name: string;
  createdAt: Date;
}

export interface GetAppointmentQuery {
  barberId?: number;
  date?: string;
  status?: "scheduled" | "canceled" | "completed";
}

export interface Appointment {
  id: number;
  userId: number;
  barberId: number;
  date: Date;
  status: "scheduled" | "canceled" | "completed";
  createdAt: Date;
}
