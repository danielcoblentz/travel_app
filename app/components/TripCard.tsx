"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import MultiView from "./MultiView"
import { Trip } from "@/app/types/trip"

interface TripCardProps extends Trip {
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export default function TripCard({
  isExpanded = false,
  onToggleExpand,
  ...props
}: TripCardProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-36 w-full">
        <Image
          src={props.imageUrl}
          alt={props.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <div className="space-y-1 p-3">
        <div className="flex justify-between items-start">
          <h2 className="text-base font-semibold">{props.name}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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

        <p className="text-sm text-gray-600">{props.destination}</p>

        <p className="text-xs text-gray-500">
          {formatDate(props.startDate)} - {formatDate(props.endDate)}
        </p>
      </div>

      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-center gap-1 py-2 border-t border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span>View details</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <MultiView {...props} />
        </div>
      )}
    </div>
  )
}
