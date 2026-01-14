import { getCountryFromCoords } from "@/app/actions/geocode";
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
    select: {
        locationTitle: true,
        lat: true,
        lng: true,
        trip: {
            select: {
                title: true
            }
        }
    } });
    

    const transformedLocations = await Promise.all(locatiomns.map(async (loc) => {
        const geoCodeResult = await getCountryFromCoords(loc.lat, loc.lng)

        return {
            name: '${log.trip.title} - ${geocodeResult.formattedAddress}',
            lat: loc.lat,
            lng: loc.lng,
            country: geoCodeResult.country
        }
    }));

    return NextResponse.json(transformedLocations);
    } catch(err){
        return new NextResponse("internal error", {status: 500})
    }

}