interface Barber {
  id: number;
  name: string;
}

export interface ListBarbersResponse {
  barbers: Barber[];
}
