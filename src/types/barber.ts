export interface Barber {
  id: number;
  name: string;
}

export interface ListBarbersResponse {
  barbers: Barber[];
}

export interface GetBarberParams {
  id: string;
}

export interface BarberId {
  id: number;
}
