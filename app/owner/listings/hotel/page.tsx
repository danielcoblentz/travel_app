"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building } from "lucide-react"
import { UploadButton } from "@/app/lib/upload-thing"

export default function AddHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    address: "",
    description: "",
    pricePerNight: "",
  })
  const [uploadedImage, setUploadedImage] = useState<{ url: string; name: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        imageUrl: uploadedImage?.url || "",
      }),
    })

    if (res.ok) {
      router.push("/owner")
    } else {
      const data = await res.json()
      alert(data.error || "Failed to create hotel")
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
            <Building className="w-5 h-5" />
            Add New Hotel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Hotel Name *</label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">City *</label>
                <Input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Country *</label>
                <Input
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Address *</label>
              <Input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price per Night ($) *</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerNight}
                onChange={(e) => updateField("pricePerNight", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hotel Image</label>
              {uploadedImage?.url && (
                <Image
                  src={uploadedImage.url}
                  alt="Hotel preview"
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                  width={300}
                  height={100}
                />
              )}
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]?.ufsUrl) {
                    setUploadedImage({ url: res[0].ufsUrl, name: res[0].name })
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("upload error:", error)
                }}
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
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Creating..." : "Create Hotel"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
