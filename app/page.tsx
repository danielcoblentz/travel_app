import { redirect } from "next/navigation";
import Link from "next/link";
import TripCard from "./components/TripCard";
import { getTripStatus } from "./lib/trip";
import EventSearch from "./components/EventSearch";
import { auth } from "@/app/auth";
import { prisma } from "./lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trip } from "@/app/types/trip";

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
    include: { images: true },
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
  }));

  return (
    <>
      <h1 className="text-3xl font-bold text-left tracking-tight p-4">Dashboard</h1>

      <div className="flex justify-end mb-4 pr-3">
        <Link href="/newTrip">
          <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-sm">Add trip</button>
        </Link>
      </div>

      <Card className="mx-4 mb-6">
        <CardHeader>
          <CardTitle>Welcome back, {session.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length === 0
              ? "No trips to display. Start planning your first trip by clicking the button above!"
              : `You have ${trips.length} ${trips.length === 1 ? "trip" : "trips"} planned.${upcomingTrips.length > 0 ? ` ${upcomingTrips.length} upcoming.` : ""}`}
          </p>
        </CardContent>

        <div className="px-6 pb-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Recent Trips
          </h2>
          {trips.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="font-medium">No trips yet.</p>
                <p className="text-gray-500 mt-2">
                  Start creating your adventure by creating your first trip.
                </p>
                <Link href="/newTrip">
                  <Button className="mt-4">New Trip</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tripsWithStatus.slice(0, 3).map((trip) => (
                <div key={trip.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{trip.name}</p>
                    <p className="text-sm text-gray-500">{trip.destination}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trip.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                    trip.status === "ongoing" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {trip.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* search events */}
      <header className="mb-6">
        <EventSearch placeholder="Search events..." />
      </header>

      <section className="mt-6 px-4">
        <h2 className="text-center text-2xl mb-6">My Trips</h2>
        {tripsWithStatus.length === 0 ? (
          <p className="text-center text-gray-500">No trips yet. Add your first trip!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {tripsWithStatus.map((trip) => <TripCard key={trip.id} {...trip} />)}
          </div>
        )}
      </section>
    </>
  );
}
