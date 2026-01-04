import { prisma } from "./prisma";
import { getTripStatus, TripStatus } from "./trip";

export type TripWithStatus = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: TripStatus;
};

export async function getTrips(userId?: string | null): Promise<TripWithStatus[]> {
  try {
    const dbTrips = await prisma.trip.findMany({
      where: userId ? { userId } : undefined,
      include: {
        images: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    const trips: TripWithStatus[] = dbTrips.map((trip) => ({
      id: trip.id,
      name: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString().split("T")[0],
      endDate: trip.endDate.toISOString().split("T")[0],
      imageUrl: trip.images[0]?.url ?? "",
      status: getTripStatus(trip.startDate, trip.endDate),
    }));

    return trips;
  } catch (error) {
    console.error("Failed to fetch trips from database:", error);
    return [];
  }
}
