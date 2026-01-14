"use client"

import { useState } from "react"
import TripCard from "./TripCard"
import { Trip } from "@/app/types/trip"

interface TripGridProps {
  trips: Trip[]
}

export default function TripGrid({ trips }: TripGridProps) {
  const [query, setQuery] = useState("")
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null)

  const filteredTrips = query
    ? trips.filter((trip) =>
        trip.name.toLowerCase().startsWith(query.toLowerCase())
      )
    : trips

  return (
    <>
      <div className="flex justify-center py-5 mb-6">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trips..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="pb-8">
        <h2 className="text-2xl font-semibold mb-6">My Trips</h2>
        {filteredTrips.length === 0 ? (
          <p className="text-center text-gray-500">
            {query ? "No trips match your search." : "No trips yet. Add your first trip!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                isExpanded={expandedTripId === trip.id}
                onToggleExpand={() =>
                  setExpandedTripId(expandedTripId === trip.id ? null : trip.id)
                }
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
