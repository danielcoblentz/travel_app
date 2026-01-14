"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, DollarSign, ShoppingCart } from "lucide-react"

type Hotel = {
  id: string
  name: string
  city: string
  country: string
  address: string
  description: string | null
  pricePerNight: number
  imageUrl: string | null
  owner: { name: string | null }
}

export default function HotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const fetchHotels = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)

    const res = await fetch(`/api/hotels?${params}`)
    const data = await res.json()
    setHotels(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchHotels()
  }

  const addToCart = async (hotelId: string) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "hotel", itemId: hotelId }),
    })

    if (res.ok) {
      router.push("/cart")
    } else {
      const data = await res.json()
      alert(data.error || "Failed to add to cart")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Hotels</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-48"
            />
            <Input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-32"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-32"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : hotels.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hotels found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden">
              {hotel.imageUrl && (
                <div className="h-40 bg-gray-200">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.city}, {hotel.country}</span>
                </div>
                {hotel.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{hotel.pricePerNight}/night</span>
                  </div>
                  <Button size="sm" onClick={() => addToCart(hotel.id)}>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
