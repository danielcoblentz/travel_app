"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plane, Building, Calendar, CheckCircle } from "lucide-react"

type CartItemWithDetails = {
  id: string
  itemType: string
  itemId: string
  tripId: string | null
  details: {
    name?: string
    city?: string
    pricePerNight?: number
    airline?: string
    flightNumber?: string
    origin?: string
    destination?: string
    price?: number
    departureTime?: string
  } | null
}

type Trip = {
  id: string
  title: string
  destination: string
}

type HotelBooking = {
  id: string
  checkIn: string
  checkOut: string
  hotel: { name: string; city: string; pricePerNight: number }
  trip: { title: string; destination: string }
}

type FlightBooking = {
  id: string
  flight: { airline: string; flightNumber: string; origin: string; destination: string; price: number }
  trip: { title: string; destination: string }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([])
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrips, setSelectedTrips] = useState<Record<string, string>>({})
  const [checkInDates, setCheckInDates] = useState<Record<string, string>>({})
  const [checkOutDates, setCheckOutDates] = useState<Record<string, string>>({})

  const fetchCart = async () => {
    const res = await fetch("/api/cart")
    if (res.ok) {
      const data = await res.json()
      setCartItems(data)
    }
    setLoading(false)
  }

  const fetchTrips = async () => {
    const res = await fetch("/api/trips")
    if (res.ok) {
      const data = await res.json()
      setTrips(data)
    }
  }

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings?view=my")
    if (res.ok) {
      const data = await res.json()
      setHotelBookings(data.hotelBookings || [])
      setFlightBookings(data.flightBookings || [])
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart()
    fetchTrips()
    fetchBookings()
  }, [])

  const removeItem = async (id: string) => {
    const res = await fetch(`/api/cart?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    }
  }

  const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end.getTime() - start.getTime()
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 0
  }

  const getItemTotal = (item: CartItemWithDetails): number => {
    if (item.itemType === "hotel" && item.details?.pricePerNight) {
      const nights = calculateNights(checkInDates[item.id], checkOutDates[item.id])
      return nights > 0 ? item.details.pricePerNight * nights : item.details.pricePerNight
    }
    if (item.itemType === "flight" && item.details?.price) {
      return item.details.price
    }
    return 0
  }

  const bookItem = async (cartItemId: string, itemType: string) => {
    const tripId = selectedTrips[cartItemId]
    if (!tripId) {
      alert("Please select a trip")
      return
    }

    const body: Record<string, string> = { cartItemId, tripId }

    if (itemType === "hotel") {
      const checkIn = checkInDates[cartItemId]
      const checkOut = checkOutDates[cartItemId]
      if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates")
        return
      }
      body.checkIn = checkIn
      body.checkOut = checkOut
    }

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setCartItems(cartItems.filter((item) => item.id !== cartItemId))
      fetchBookings()
    } else {
      const data = await res.json()
      alert(data.error || "Booking failed")
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0)
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
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Your cart is empty
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {item.itemType === "hotel" ? (
                          <Building className="w-6 h-6 text-gray-600" />
                        ) : (
                          <Plane className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {item.itemType === "hotel"
                            ? item.details?.name
                            : `${item.details?.airline} ${item.details?.flightNumber}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.itemType === "hotel"
                            ? item.details?.city
                            : `${item.details?.origin} → ${item.details?.destination}`}
                        </p>
                        <p className="text-emerald-600 font-semibold mt-1">
                          ${item.itemType === "hotel" ? item.details?.pricePerNight : item.details?.price}
                          {item.itemType === "hotel" && "/night"}
                        </p>
                        {item.itemType === "hotel" && checkInDates[item.id] && checkOutDates[item.id] && (
                          <p className="text-sm text-gray-600 mt-1">
                            {calculateNights(checkInDates[item.id], checkOutDates[item.id])} nights =
                            <span className="font-semibold text-emerald-600 ml-1">
                              ${getItemTotal(item).toFixed(2)} total
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Assign to trip</label>
                      <select
                        className="w-full border rounded-md p-2 text-sm"
                        value={selectedTrips[item.id] || ""}
                        onChange={(e) =>
                          setSelectedTrips({ ...selectedTrips, [item.id]: e.target.value })
                        }
                      >
                        <option value="">Select a trip</option>
                        {trips.map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {trip.title} - {trip.destination}
                          </option>
                        ))}
                      </select>
                    </div>

                    {item.itemType === "hotel" && (
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-1 block">Check-in</label>
                          <Input
                            type="date"
                            value={checkInDates[item.id] || ""}
                            onChange={(e) =>
                              setCheckInDates({ ...checkInDates, [item.id]: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-1 block">Check-out</label>
                          <Input
                            type="date"
                            value={checkOutDates[item.id] || ""}
                            onChange={(e) =>
                              setCheckOutDates({ ...checkOutDates, [item.id]: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => bookItem(item.id, item.itemType)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <span className="text-lg font-semibold">Estimated Total</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </CardContent>
          </Card>
        </>
      )}

      {(hotelBookings.length > 0 || flightBookings.length > 0) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            Confirmed Bookings
          </h2>
          <div className="space-y-4">
            {hotelBookings.map((booking) => (
              <Card key={booking.id} className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Building className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{booking.hotel.name}</p>
                      <p className="text-sm text-gray-600">{booking.hotel.city}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Trip: {booking.trip.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-600 font-semibold">
                        ${booking.hotel.pricePerNight}/night
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {flightBookings.map((booking) => (
              <Card key={booking.id} className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Plane className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {booking.flight.airline} {booking.flight.flightNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.flight.origin} → {booking.flight.destination}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Trip: {booking.trip.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-600 font-semibold">
                        ${booking.flight.price}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
