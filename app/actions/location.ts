"use server";

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export async function addLocation(formData: FormData, tripId: string) {
    const address = formData.get("address") as string;

    if (!address) {
        throw new Error("Address is required");
    }

    // TODO: Use a geocoding API to get lat/lng from address
    // For now, using placeholder coordinates
    const lat = 0;
    const lng = 0;

    await prisma.location.create({
        data: {
            locationTitle: address,
            lat,
            lng,
            tripId,
        },
    });

    redirect(`/trips/${tripId}`);
}

export async function deleteLocation(locationId: string, tripId: string) {
    await prisma.location.delete({
        where: { id: locationId },
    });

    redirect(`/trips/${tripId}`);
}
