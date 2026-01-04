import Link from "next/link";
import TripCard from "./components/TripCard";
import { getTripStatus, TripStatus } from "./lib/trip";
import TripsSearch from "./components/TripsSearch";

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

export default function TripsPage() {
  // Map trips into the simple shape TripsSearch expects
  const searchable = trips.map((t) => ({ id: t.id, text: `${t.name} — ${t.destination}` }));

  return (
    <>
      {/* search to the top of the page */}
      <header className="mb-6">
        <TripsSearch trips={searchable} />
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
        {/* No additional search here — TripsSearch at top is the single search bar */}
        {/* ...existing content... */}
      </section>
    </>
  );
}
