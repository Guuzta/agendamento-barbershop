import { formatInTimeZone } from "date-fns-tz";

function isWithinWorkingHours(dateUTC: Date): boolean {
  const TIMEZONE = "America/Sao_Paulo";

  const hour = Number(formatInTimeZone(dateUTC, TIMEZONE, "HH"));

  return hour >= 9 && hour < 17;
}

export default isWithinWorkingHours;
