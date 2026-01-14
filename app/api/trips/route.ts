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
