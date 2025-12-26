export type TripStatus = "upcoming" | "ongoing" | "completed";

export function getTripStatus(
  startDate: Date,
  endDate: Date,
  now: Date = new Date()
): TripStatus {
  if (now < startDate) return "upcoming";
  if (now > endDate) return "completed";
  return "ongoing";
}
