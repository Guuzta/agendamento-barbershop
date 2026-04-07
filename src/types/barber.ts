export interface Barber {
  id: number;
  name: string;
}

export interface ListBarbersResponse {
  barbers: Barber[];
}

export interface GetBarberParams {
  id: number;
}

export interface GetBarberQuery {
  date: string;
}

export interface BarberId {
  id: number;
}
