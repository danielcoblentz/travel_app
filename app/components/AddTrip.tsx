"use client";
import { useState } from "react";
import { UploadButton } from "@/app/lib/upload-thing";

export default function AddTrip() {
  const [trip, setTrip] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
  });

  const [uploadedImage, setUploadedImage] = useState<{ url: string; name: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...trip,
      image: uploadedImage,
    };

    console.log("Trip data submitted:", payload);

    // reset form after submit
    setTrip({
      name: "",
      destination: "",
      startDate: "",
      endDate: "",
    });
    setUploadedImage(null);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Add New Trip</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">Trip Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={trip.name}
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


      <label>Trip Image</label>

      {<imageUrl && (
        <Image src={imageUrl} alt="Trip repview" className="w-full mb-4 rounded-md max-h-48 object-cover" width={300} height={100/>)}

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res[0]?.ufsUrl) {
            setUploadedImage({ url: res[0].ufsUrl, name: res[0].name });
          }
        }}
        onUploadError={(error: Error) => {
          console.error("upload error:", error);
        }}
      />

        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded">
          Add Trip
        </button>
      </form>
    </div>
  );
}