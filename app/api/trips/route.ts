import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, destination, startDate, endDate, image } = body;

  if (!name || !destination || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trip = await prisma.trip.create({
    data: {
      title: name,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: session.user.id,
      images: image?.url
        ? {
            create: {
              url: image.url,
              filename: image.name,
            },
          }
        : undefined,
    },
    include: { images: true },
  });

  return NextResponse.json(trip, { status: 201 });
}

export async function GET() {
  // Replace with your actual data fetching logic
  const locations = [
    { lat: 48.8566, lng: 2.3522, country: "France" },
    { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
    // Add your actual data source here
  ];

  return NextResponse.json(locations);
}
