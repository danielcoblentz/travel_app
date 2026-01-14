import { redirect } from "next/navigation";
import Link from "next/link";
import TripCard from "./components/TripCard";
import { getTripStatus, TripStatus } from "./lib/trip";
import EventSearch from "./components/EventSearch";
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
          <Button>Add trip</Button>
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

      <div className="mb-6">
        <EventSearch placeholder="Search events..." />
      </div>

      <section className="pb-8">
        <h2 className="text-2xl font-semibold mb-6">My Trips</h2>
        {tripsWithStatus.length === 0 ? (
          <p className="text-center text-gray-500">No trips yet. Add your first trip!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripsWithStatus.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
