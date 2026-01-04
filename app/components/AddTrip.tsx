"use client";
import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/app/lib/upload-thing";
import { createTrip } from "@/app/create-trip";

export default function AddTrip() {
  const [trip, setTrip] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [uploadedImage, setUploadedImage] = useState<{ url: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createTrip({
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        imageUrl: uploadedImage?.url,
        imageName: uploadedImage?.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Add New Trip</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">Trip Name</label>
          <input
            type="text"
            name="title"
            id="title"
            value={trip.title}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="destination">Destination</label>
          <input
            type="text"
            name="destination"
            id="destination"
            value={trip.destination}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={trip.startDate}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={trip.endDate}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Trip Image</label>

          {uploadedImage?.url && (
            <Image
              src={uploadedImage.url}
              alt="Trip preview"
              className="w-full mb-4 rounded-md max-h-48 object-cover"
              width={300}
              height={100}
            />
          )}

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]?.ufsUrl) {
                setUploadedImage({ url: res[0].ufsUrl, name: res[0].name });
              }
            }}
            onUploadError={(error: Error) => {
              console.error("upload error:", error);
              setError("Failed to upload image");
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded w-full disabled:opacity-50"
        >
          {isSubmitting ? "Adding Trip..." : "Add Trip"}
        </button>
      </form>
    </div>
  );
}
