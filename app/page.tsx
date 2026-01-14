import { redirect } from "next/navigation";
import Link from "next/link";
import TripGrid from "./components/TripGrid";
import { getTripStatus, TripStatus } from "./lib/trip";
import { auth } from "@/app/auth";
import { prisma } from "./lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status?: TripStatus;
};

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
    include: { images: true, locations: true },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  const tripsWithStatus: (Trip & { status: TripStatus })[] = sortedTrips.map((trip) => ({
    id: trip.id,
    name: trip.title,
    destination: trip.destination,
    startDate: trip.startDate.toISOString().split("T")[0],
    endDate: trip.endDate.toISOString().split("T")[0],
    imageUrl: trip.images[0]?.url ?? "/images/placeholder.jpg",
    status: getTripStatus(new Date(trip.startDate), new Date(trip.endDate)) ?? "upcoming",
    locations: trip.locations.map((loc) => ({
      id: loc.id,
      locationTitle: loc.locationTitle,
      lat: loc.lat,
      lng: loc.lng,
    })),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/newTrip">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add trip</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome back, {session.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {trips.length === 0
              ? "No trips yet. Start planning your first adventure!"
              : `You have ${trips.length} ${trips.length === 1 ? "trip" : "trips"} planned.${upcomingTrips.length > 0 ? ` ${upcomingTrips.length} upcoming.` : ""}`}
          </p>
        </CardContent>
      </Card>

      <TripGrid trips={tripsWithStatus} />
    </div>
  );
}
