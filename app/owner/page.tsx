"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Plane, Plus, Calendar, User } from "lucide-react"

type Hotel = {
  id: string
  name: string
  city: string
  country: string
  pricePerNight: number
}

type Flight = {
  id: string
  airline: string
  flightNumber: string
  origin: string
  destination: string
  price: number
}

type HotelBooking = {
  id: string
  checkIn: string
  checkOut: string
  hotel: Hotel
  trip: { user: { name: string | null; email: string | null } }
}

type FlightBooking = {
  id: string
  flight: Flight
  trip: { user: { name: string | null; email: string | null } }
}

export default function OwnerDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([])
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
    fetchBookings()
  }, [])

  const fetchListings = async () => {
    const [hotelsRes, flightsRes] = await Promise.all([
      fetch("/api/hotels"),
      fetch("/api/flights"),
    ])

    if (hotelsRes.ok) setHotels(await hotelsRes.json())
    if (flightsRes.ok) setFlights(await flightsRes.json())
    setLoading(false)
  }

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings")
    if (res.ok) {
      const data = await res.json()
      setHotelBookings(data.hotelBookings || [])
      setFlightBookings(data.flightBookings || [])
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/owner/listings/hotel">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-1" />
              Add Hotel
            </Button>
          </Link>
          <Link href="/owner/listings/flight">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              Add Flight
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-6">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Hotels ({hotels.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hotels.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hotels listed</p>
                ) : (
                  <div className="space-y-3">
                    {hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="p-3 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{hotel.name}</p>
                          <p className="text-sm text-gray-500">
                            {hotel.city}, {hotel.country}
                          </p>
                        </div>
                        <p className="text-emerald-600 font-semibold">
                          ${hotel.pricePerNight}/night
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Flights ({flights.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {flights.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No flights listed</p>
                ) : (
                  <div className="space-y-3">
                    {flights.map((flight) => (
                      <div
                        key={flight.id}
                        className="p-3 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">
                            {flight.airline} {flight.flightNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {flight.origin} → {flight.destination}
                          </p>
                        </div>
                        <p className="text-emerald-600 font-semibold">${flight.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Hotel Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hotelBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hotel bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {hotelBookings.map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{booking.hotel.name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{booking.trip.user.name || booking.trip.user.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Flight Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {flightBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No flight bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {flightBookings.map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {booking.flight.airline} {booking.flight.flightNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.flight.origin} → {booking.flight.destination}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{booking.trip.user.name || booking.trip.user.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
