import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where: Record<string, unknown> = {};

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    where.pricePerNight = {};
    if (minPrice) (where.pricePerNight as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.pricePerNight as Record<string, number>).lte = parseFloat(maxPrice);
  }

  const hotels = await prisma.hotel.findMany({
    where,
    include: { owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(hotels);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "OWNER") {
    return NextResponse.json({ error: "Only owners can create hotels" }, { status: 403 });
  }

  const body = await request.json();
  const { name, city, country, address, description, pricePerNight, imageUrl } = body;

  if (!name || !city || !country || !address || !pricePerNight) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const hotel = await prisma.hotel.create({
    data: {
      name,
      city,
      country,
      address,
      description,
      pricePerNight: parseFloat(pricePerNight),
      imageUrl,
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(hotel, { status: 201 });
}
