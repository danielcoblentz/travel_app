"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane, Clock, DollarSign, ShoppingCart, Globe, Database, Info } from "lucide-react"

type Flight = {
  id: string
  airline: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  owner?: { name: string | null }
  isRealFlight?: boolean
  status?: string
}

export default function FlightsPage() {
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [searchMode, setSearchMode] = useState<"local" | "real">("local")
  const [error, setError] = useState<string | null>(null)

  const fetchFlights = async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (origin) params.set("origin", origin)
    if (destination) params.set("destination", destination)
    if (date) params.set("date", date)

    const endpoint = searchMode === "real" ? "/api/flights/search" : "/api/flights"

    try {
      const res = await fetch(`${endpoint}?${params}`)
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setFlights([])
      } else {
        setFlights(Array.isArray(data) ? data : [])
      }
    } catch {
      setError("Failed to fetch flights")
      setFlights([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFlights()
  }, [searchMode])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchFlights()
  }

  const addToCart = async (flightId: string) => {
    // Only allow adding local flights to cart
    if (flightId.startsWith("real-")) {
      alert("Real-time flights are for informational purposes. Book through the airline's website.")
      return
    }

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

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "en-route":
        return "text-green-600 bg-green-100"
      case "landed":
        return "text-blue-600 bg-blue-100"
      case "scheduled":
        return "text-yellow-600 bg-yellow-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Flights</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={searchMode === "local" ? "default" : "outline"}
              onClick={() => setSearchMode("local")}
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Local Listings
            </Button>
            <Button
              variant={searchMode === "real" ? "default" : "outline"}
              onClick={() => setSearchMode("real")}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Real Flights
            </Button>
          </div>

          {searchMode === "real" && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Search Real Flights</p>
                <p>Use 3-letter IATA airport codes (e.g., JFK, LAX, LHR, CDG). Real flights are for informational purposes only.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <Input
              placeholder={searchMode === "real" ? "From (IATA code)" : "From (city)"}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder={searchMode === "real" ? "To (IATA code)" : "To (city)"}
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : flights.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          {searchMode === "real"
            ? "No flights found. Try different IATA codes or dates."
            : "No flights found"}
        </p>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className={flight.isRealFlight ? "border-blue-200" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[100px]">
                      <p className="font-semibold text-lg">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                      {flight.isRealFlight && flight.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      )}
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
                    {!flight.isRealFlight && (
                      <>
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-lg">
                          <DollarSign className="w-5 h-5" />
                          <span>{flight.price}</span>
                        </div>
                        <Button onClick={() => addToCart(flight.id)}>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </>
                    )}
                    {flight.isRealFlight && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Live Data
                      </span>
                    )}
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
