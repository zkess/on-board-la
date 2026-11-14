import { getTimes } from "suncalc";

export const VENICE_COORDINATES = { lat: 33.985, lng: -118.47 };

export function veniceSunset(date: Date): Date | null {
  return getTimes(date, VENICE_COORDINATES.lat, VENICE_COORDINATES.lng).sunset;
}

export function sunsetLabel(date: Date): string | null {
  const sunset = veniceSunset(date);
  return sunset ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" }).format(sunset) : null;
}