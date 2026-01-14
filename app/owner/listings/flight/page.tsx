"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane } from "lucide-react"

export default function AddFlightPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    airline: "",
    flightNumber: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/owner")
    } else {
      const data = await res.json()
      alert(data.error || "Failed to create flight")
    }

    setLoading(false)
  }

  const updateField = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Add New Flight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Airline *</label>
                <Input
                  value={form.airline}
                  onChange={(e) => updateField("airline", e.target.value)}
                  placeholder="e.g. Delta"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Flight Number *</label>
                <Input
                  value={form.flightNumber}
                  onChange={(e) => updateField("flightNumber", e.target.value)}
                  placeholder="e.g. DL123"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Origin City *</label>
                <Input
                  value={form.origin}
                  onChange={(e) => updateField("origin", e.target.value)}
                  placeholder="e.g. New York"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Destination City *</label>
                <Input
                  value={form.destination}
                  onChange={(e) => updateField("destination", e.target.value)}
                  placeholder="e.g. Los Angeles"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Departure Time *</label>
                <Input
                  type="datetime-local"
                  value={form.departureTime}
                  onChange={(e) => updateField("departureTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Arrival Time *</label>
                <Input
                  type="datetime-local"
                  value={form.arrivalTime}
                  onChange={(e) => updateField("arrivalTime", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price ($) *</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Creating..." : "Create Flight"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
