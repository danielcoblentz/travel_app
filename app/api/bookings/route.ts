import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { cartItemId, tripId, checkIn, checkOut } = body;

  if (!cartItemId || !tripId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId, userId: session.user.id },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId, userId: session.user.id },
  });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  let booking;

  if (cartItem.itemType === "hotel") {
    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: "Check-in and check-out dates required for hotel" }, { status: 400 });
    }

    booking = await prisma.hotelBooking.create({
      data: {
        hotelId: cartItem.itemId,
        tripId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
      },
    });
  } else if (cartItem.itemType === "flight") {
    booking = await prisma.flightBooking.create({
      data: {
        flightId: cartItem.itemId,
        tripId,
      },
    });
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  return NextResponse.json(booking, { status: 201 });
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "OWNER") {
    return NextResponse.json({ error: "Only owners can view all bookings" }, { status: 403 });
  }

  const hotelBookings = await prisma.hotelBooking.findMany({
    where: { hotel: { ownerId: session.user.id } },
    include: {
      hotel: true,
      trip: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const flightBookings = await prisma.flightBooking.findMany({
    where: { flight: { ownerId: session.user.id } },
    include: {
      flight: true,
      trip: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ hotelBookings, flightBookings });
}
