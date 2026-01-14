import { getCountryFromCoords } from "@/app/actions/geocode";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("you are not authenticated", {status: 401})
        }

        const locations = await prisma.location.findMany({ 
            where: {
                trip: {
                    userId: session.user.id
                },
            },
            select: {
                locationTitle: true,
                lat: true,
                lng: true,
                trip: {
                    select: {
                        title: true
                    }
                }
            } 
        });

        if (!locations || locations.length === 0) {
            return NextResponse.json([]);
        }
    
        const transformedLocations = await Promise.all(locations.map(async (loc) => {
            try {
                const geoCodeResult = await getCountryFromCoords(loc.lat, loc.lng);

                return {
                    name: `${loc.trip.title} - ${geoCodeResult?.formattedAddress || 'Unknown'}`,
                    lat: loc.lat,
                    lng: loc.lng,
                    country: geoCodeResult?.country || 'Unknown'
                };
            } catch (geoError) {
                console.error("Geocode error for location:", loc, geoError);
                return {
                    name: `${loc.trip.title} - ${loc.locationTitle}`,
                    lat: loc.lat,
                    lng: loc.lng,
                    country: 'Unknown'
                };
            }
        }));

        return NextResponse.json(transformedLocations);
    } catch(err) {
        console.error("API pins error:", err);
        return new NextResponse("internal error", {status: 500});
    }
}