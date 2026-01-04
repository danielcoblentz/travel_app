import Link from "next/link";
import { redirect } from "next/navigation";
import TripCard from "./components/TripCard";
import TripsSearch from "./components/TripsSearch";
import { getTrips } from "./lib/get-trips";
import { auth } from "./auth";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const trips = await getTrips(session.user?.id);

  const searchable = trips.map((t) => ({ id: t.id, text: `${t.name} — ${t.destination}` }));

  return (
    <>
      <header className="mb-6">
        <TripsSearch trips={searchable} />
      </header>

      <div className="flex justify-end mb-4 pr-3">
        <Link href="/newTrip">
          <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-sm">Add trip</button>
        </Link>
      </div>

      {trips.length > 0 ? (
        <div className="flex justify-center mt-10">
          <div className="w-full max-w-4xl space-y-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </div>
      ) : (
        <section className="mt-10">
          <h2 className="text-center text-2xl mb-4 text-gray-500">No trips yet</h2>
          <p className="text-center text-gray-400">Add your first trip to get started!</p>
        </section>
      )}
    </>
  );
}
