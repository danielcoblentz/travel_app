import { NextRequest, NextResponse } from "next/server";

type AviationStackFlight = {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    scheduled: string;
    estimated: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    scheduled: string;
    estimated: string;
  };
  airline: {
    name: string;
    iata: string;
  };
  flight: {
    number: string;
    iata: string;
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Flight API not configured. Add AVIATIONSTACK_API_KEY to .env" },
      { status: 500 }
    );
  }

  try {
    // Build AviationStack API URL
    const params = new URLSearchParams({
      access_key: apiKey,
    });

    // AviationStack uses IATA codes, but we'll search by airport name/city
    if (origin) params.set("dep_iata", origin.toUpperCase());
    if (destination) params.set("arr_iata", destination.toUpperCase());
    if (date) params.set("flight_date", date);

    // Note: Free tier only supports HTTP, paid tier supports HTTPS
    const apiUrl = `http://api.aviationstack.com/v1/flights?${params}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error("AviationStack error:", data.error);
      return NextResponse.json(
        { error: data.error.message || "Failed to fetch flights" },
        { status: 400 }
      );
    }

    // Transform AviationStack data to our format
    const flights = (data.data || []).map((flight: AviationStackFlight, index: number) => ({
      id: `real-${index}-${flight.flight?.iata || index}`,
      airline: flight.airline?.name || "Unknown Airline",
      flightNumber: flight.flight?.iata || flight.flight?.number || "N/A",
      origin: flight.departure?.iata || flight.departure?.airport || "N/A",
      destination: flight.arrival?.iata || flight.arrival?.airport || "N/A",
      departureTime: flight.departure?.scheduled || new Date().toISOString(),
      arrivalTime: flight.arrival?.scheduled || new Date().toISOString(),
      price: Math.floor(Math.random() * 400) + 100, // Random price since API doesn't provide it
      isRealFlight: true,
      status: flight.flight_status,
    }));

    return NextResponse.json(flights);
  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 }
    );
  }
}
