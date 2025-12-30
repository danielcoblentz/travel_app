"use client";
import { useState } from "react";

export default function AddTrip() {
  const [trip, setTrip] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedImage(null);
      setImagePreviewUrl(null);
      return;
    }
    const file = files[0];
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("file", file);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadPercent(percent);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch (err) {
              resolve({ success: true, data: xhr.responseText });
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        reject(new Error("Network error during upload"));
      };

      xhr.open("POST", "/api/upload");
      setIsUploading(true);
      xhr.send(fd);
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedFileInfo = null;
      if (selectedImage) {
        const res = await uploadImageFile(selectedImage);
        uploadedFileInfo = res;
      }

      const payload = {
        ...trip,
        image: uploadedFileInfo,
      };

      console.log("Trip data submitted:", payload);

      setTrip({
        name: "",
        destination: "",
        startDate: "",
        endDate: "",
      });
      setSelectedImage(null);
      setImagePreviewUrl(null);
      setUploadPercent(null);
    } catch (err) {
      console.error("Submission error:", err);
    }
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="imageUpload">Upload Image</label>
          <input
            type="file"
            id="imageUpload"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          {imagePreviewUrl && (
            <div className="mt-3">
              <img src={imagePreviewUrl} alt="preview" className="w-32 h-32 object-cover rounded" />
              <div className="flex items-center mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => { setSelectedImage(null); setImagePreviewUrl(null); setUploadPercent(null); }}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {isUploading && uploadPercent !== null && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-gray-800 h-2 rounded" style={{ width: `${uploadPercent}%` }} />
              </div>
              <p className="text-sm mt-1">{uploadPercent}%</p>
            </div>
          )}
        </div>

        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Add Trip"}
        </button>
      </form>
    </div>
  );
}