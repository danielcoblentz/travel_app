"use client"

interface NewLocationClientProps {
    tripId: string
}

export default function NewLocationClient({ tripId }: NewLocationClientProps) {
    return (
        <div>
            <h1>Itinerary for Trip {tripId}</h1>
            {/*itinerary content here */}
        </div>
    )
}