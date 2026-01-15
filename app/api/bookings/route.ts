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

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const viewType = searchParams.get("view");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  // If owner viewing their listings' bookings
  if (user?.role === "OWNER" && viewType !== "my") {
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

  // Return user's own bookings (through their trips)
  const hotelBookings = await prisma.hotelBooking.findMany({
    where: { trip: { userId: session.user.id } },
    include: {
      hotel: true,
      trip: { select: { title: true, destination: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const flightBookings = await prisma.flightBooking.findMany({
    where: { trip: { userId: session.user.id } },
    include: {
      flight: true,
      trip: { select: { title: true, destination: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ hotelBookings, flightBookings });
}
