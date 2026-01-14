"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane, Clock, DollarSign, ShoppingCart } from "lucide-react"

type Flight = {
  id: string
  airline: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  owner: { name: string | null }
}

export default function FlightsPage() {
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")

  const fetchFlights = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (origin) params.set("origin", origin)
    if (destination) params.set("destination", destination)
    if (date) params.set("date", date)

    const res = await fetch(`/api/flights?${params}`)
    const data = await res.json()
    setFlights(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchFlights()
  }

  const addToCart = async (flightId: string) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "flight", itemId: flightId }),
    })

    if (res.ok) {
      router.push("/cart")
    } else {
      const data = await res.json()
      alert(data.error || "Failed to add to cart")
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Flights</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <Input
              placeholder="From (city)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="To (city)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-40"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : flights.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No flights found</p>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-semibold text-lg">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold text-lg">{formatTime(flight.departureTime)}</p>
                        <p className="text-sm text-gray-500">{flight.origin}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-16 h-px bg-gray-300" />
                        <Plane className="w-4 h-4" />
                        <div className="w-16 h-px bg-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-lg">{formatTime(flight.arrivalTime)}</p>
                        <p className="text-sm text-gray-500">{flight.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(flight.departureTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>{flight.price}</span>
                    </div>
                    <Button onClick={() => addToCart(flight.id)}>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
