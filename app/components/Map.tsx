"use client"

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Location } from "@/app/types/trip";

interface MapProps {
    locations: Location[];
}

export default function Map({ locations }: MapProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    if (loadError) {
        return <div>error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>loading maps...</div>;
    }

    const center = locations.length > 0
        ? { lat: locations[0].lat, lng: locations[0].lng }
        : { lat: 0, lng: 0 };

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "250px" }}
            zoom={8}
            center={center}
        >
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    position={{ lat: location.lat, lng: location.lng }}
                    title={location.locationTitle}
                />
            ))}
        </GoogleMap>
    );
}
