"use client"

// displays a single trip summary card
import Image from "next/image";
import MultiView from "./MultiView";

type TripCardProps = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: "upcoming" | "ongoing" | "completed";
};

export default function TripCard(props: TripCardProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full">
        <Image src={props.imageUrl} alt={props.name} width={100} height={100} />
      </div>

      <div className="space-y-2 p-4">
        <h2 className="text-lg font-semibold">{props.name}</h2>

        <p className="text-sm text-gray-600">{props.destination}</p>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {formatDate(props.startDate)} - {formatDate(props.endDate)}
          </p>
          <button className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded-sm text-sm">
            Add location
          </button>
        </div>

        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            props.status === "upcoming"
              ? "bg-blue-100 text-blue-700"
              : props.status === "ongoing"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {props.status}
        </span>
      </div>

      <div className="p-4 border-t border-gray-200">
        <MultiView />
      </div>
    </div>
  );
}
