import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {};

  if (origin) {
    where.origin = { contains: origin, mode: "insensitive" };
  }

  if (destination) {
    where.destination = { contains: destination, mode: "insensitive" };
  }

  if (date) {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    where.departureTime = { gte: searchDate, lt: nextDay };
  }

  const flights = await prisma.flight.findMany({
    where,
    include: { owner: { select: { name: true } } },
    orderBy: { departureTime: "asc" },
  });

  return NextResponse.json(flights);
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
    return NextResponse.json({ error: "Only owners can create flights" }, { status: 403 });
  }

  const body = await request.json();
  const { airline, flightNumber, origin, destination, departureTime, arrivalTime, price } = body;

  if (!airline || !flightNumber || !origin || !destination || !departureTime || !arrivalTime || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const flight = await prisma.flight.create({
    data: {
      airline,
      flightNumber,
      origin,
      destination,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      price: parseFloat(price),
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(flight, { status: 201 });
}
