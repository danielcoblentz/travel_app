import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//finds all countries that the user will go to
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("you are not authenticated", {status: 401})
        }

        const locatiomns = await prisma.location.findMany({ where: {
            trip: {
                userId: session.user?.id
            },
        },
    sekect: {
        locationTitle: true,
        lat: true,
        lng: true
        trip: {
            title: true,
        }
    } })

    const transformedLocations = await Promise.all(locatiomns.map(async (loc) => {
        cont geoCodeResult = await getCountryFromCoords(loc.lat, loc.lng)

        return {
            name: '${log.trip.title} - ${geocodeResult.formattedAddress'
            lat: loc.lat,
            lng: loc.lng,
            country: geocodewResult.country
        }
    }))
    } catch(err){}

}