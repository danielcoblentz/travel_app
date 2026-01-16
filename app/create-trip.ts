"use server";

import { prisma } from "./lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "./auth";

type CreateTripInput = {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    imageName?: string;
};

export async function createTrip(input: CreateTripInput) {
    const session = await auth();

    const { title, destination, startDate, endDate, imageUrl, imageName } = input;

    if (!title || !destination || !startDate || !endDate) {
        throw new Error("All fields are required.");
    }

    await prisma.trip.create({
        data: {
            title,
            destination,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            userId: session?.user?.id ?? null,
            images: imageUrl ? {
                create: {
                    url: imageUrl,
                    filename: imageName ?? null,
                }
            } : undefined,
        },
        include: {
            images: true,
        },
    });

    redirect("/");
}
