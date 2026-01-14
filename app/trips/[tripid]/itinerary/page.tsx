import { redirect } from "next/navigation"
import { auth } from "@/app/auth"
import { prisma } from "@/app/lib/prisma"
import SortableItinerary from "@/app/components/SortableItinerary"

export default async function ItineraryPage({ params }: { params: Promise<{ tripid: string }> }) {
    const session = await auth()

    if (!session) {
        redirect("/signin")
    }

    const { tripid } = await params

    const trip = await prisma.trip.findUnique({
        where: { id: tripid },
        include: { locations: true }
    })

    if (!trip) {
        redirect("/")
    }

    const locations = trip.locations.map((loc) => ({
        id: loc.id,
        locationTitle: loc.locationTitle,
        lat: loc.lat,
        lng: loc.lng,
    }))

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">{trip.title} - Itinerary</h1>
            <SortableItinerary locations={locations} />
        </div>
    )
}
