import { addDays, setHours, setMinutes } from "date-fns";

function createAppointmentDate(): string {
  let date = addDays(new Date(), 1);

  const startHour = 9;
  const endHour = 17;

  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;

  date = setHours(date, hour);
  date = setMinutes(date, 0);

  return date.toISOString();
}

export default createAppointmentDate;
