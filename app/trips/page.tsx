// app/trips/page.tsx
import Link from "next/link";
import TripCard from "../components/TripCard";
import { getTripStatus, TripStatus } from "../lib/trip";

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status?: TripStatus;
};

const trips: Trip[] = [
  {
    id: "1",
    name: "Japan Spring 2026",
    destination: "Tokyo, Japan",
    startDate: "2026-03-12",
    endDate: "2026-03-26",
    imageUrl: "/images/japan.jpg",
  },
];

const tripsWithStatus = trips.map((trip) => ({
  ...trip,
  status: getTripStatus(new Date(trip.startDate), new Date(trip.endDate)),
}));

export default function TripsPage() {
  return (
    <>
      <div className="flex justify-end mb-4 pr-3">
        <Link
          href="/trips/new"
          className="inline-flex items-center rounded-sm bg-gray-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
        >
          Add trip
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tripsWithStatus.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))}
      </div>
    </>
  );
}
