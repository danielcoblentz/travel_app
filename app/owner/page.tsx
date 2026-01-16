"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Plus, Calendar, User } from "lucide-react"

type Hotel = {
  id: string
  name: string
  city: string
  country: string
  pricePerNight: number
}

type HotelBooking = {
  id: string
  checkIn: string
  checkOut: string
  hotel: Hotel
  trip: { user: { name: string | null; email: string | null } }
}

export default function OwnerDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [hotelsRes, bookingsRes] = await Promise.all([
        fetch("/api/hotels"),
        fetch("/api/bookings"),
      ])

      if (hotelsRes.ok) setHotels(await hotelsRes.json())
      if (bookingsRes.ok) {
        const data = await bookingsRes.json()
        setHotelBookings(data.hotelBookings || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hotel Owner Dashboard</h1>
        <Link href="/owner/listings/hotel">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Hotel
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              My Hotels ({hotels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotels.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hotels listed yet</p>
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
              <Calendar className="w-5 h-5" />
              Bookings ({hotelBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotelBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {hotelBookings.map((booking) => (
                  <div key={booking.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.hotel.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
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
    </div>
  )
}
