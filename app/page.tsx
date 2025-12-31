import Link from "next/link";
import TripCard from "./components/TripCard";
import { getTripStatus, TripStatus } from "./lib/trip";

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status?: TripStatus;
};
//sample data remove later on 
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
  status: getTripStatus(new Date(trip.startDate), new Date(trip.endDate)),}));

export default function TripsPage() {
  return (
    <>
      <div className="flex justify-end mb-4 pr-3">
        <Link href="/newTrip">
          <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-sm">
            Add trip
          </button>
        </Link>
      </div>


      <div className="flex justify-center mt-10">
        <div className="w-full max-w-4xl space-y-6">
          <TripCard {...tripsWithStatus[0]} />
        </div>
      </div>
    </>
  );
}
