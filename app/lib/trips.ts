import { prisma } from "./prisma";
import { auth } from "../auth";

export async function getUserTrips() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const trips = await prisma.trip.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      images: true,
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return trips.map((trip) => ({
    id: trip.id,
    name: trip.title,
    destination: trip.destination,
    startDate: trip.startDate.toISOString().split("T")[0],
    endDate: trip.endDate.toISOString().split("T")[0],
    imageUrl: trip.images[0]?.url ?? "/images/placeholder.jpg",
  }));
}
