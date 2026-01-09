import { redirect } from "next/navigation";
import Link from "next/link";
import TripCard from "./components/TripCard";
import { getTripStatus, TripStatus } from "./lib/trip";
import EventSearch from "./components/EventSearch";
import { auth } from "@/app/auth";

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status?: TripStatus;
};

// sample data — replace with real source later
const trips: Trip[] = [
  {
    id: "1",
    name: "Japan Spring 2026",
    destination: "Tokyo, Japan",
    startDate: "2026-03-12",
    endDate: "2026-03-26",
    imageUrl: "/images/japan.jpg",
  },
  { id: "2", name: "Paris", destination: "Paris, France", startDate: "", endDate: "", imageUrl: "" },
  { id: "3", name: "New York", destination: "New York, USA", startDate: "", endDate: "", imageUrl: "" },
  { id: "4", name: "Tokyo", destination: "Tokyo, Japan", startDate: "", endDate: "", imageUrl: "" },
  { id: "5", name: "London", destination: "London, UK", startDate: "", endDate: "", imageUrl: "" },
];

const tripsWithStatus: (Trip & { status: TripStatus })[] = trips.map((trip) => ({
  ...trip,
  status: getTripStatus(new Date(trip.startDate), new Date(trip.endDate)) ?? "upcoming",
}));

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      {/* search events */}
      <header className="mb-6">
        <EventSearch placeholder="Search events..." />
      </header>

      <div className="flex justify-end mb-4 pr-3">
        <Link href="/newTrip">
          <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-sm">Add trip</button>
        </Link>
      </div>

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-4xl space-y-6">
          {tripsWithStatus.length > 0 && <TripCard {...tripsWithStatus[0]} />}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-center text-2xl mb-4">Trips</h2> 
      </section>

      <div className="space-y-6 container">
      </div>
    </>
  );
}
