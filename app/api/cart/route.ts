import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const itemsWithDetails = await Promise.all(
    cartItems.map(async (item) => {
      let details = null;
      if (item.itemType === "hotel") {
        details = await prisma.hotel.findUnique({ where: { id: item.itemId } });
      } else if (item.itemType === "flight") {
        details = await prisma.flight.findUnique({ where: { id: item.itemId } });
      }
      return { ...item, details };
    })
  );

  return NextResponse.json(itemsWithDetails);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { itemType, itemId, tripId } = body;

  if (!itemType || !itemId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.cartItem.findFirst({
    where: { userId: session.user.id, itemType, itemId },
  });

  if (existing) {
    return NextResponse.json({ error: "Item already in cart" }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      userId: session.user.id,
      itemType,
      itemId,
      tripId,
    },
  });

  return NextResponse.json(cartItem, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing cart item id" }, { status: 400 });
  }

  await prisma.cartItem.delete({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
