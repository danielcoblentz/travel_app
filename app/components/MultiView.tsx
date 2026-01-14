"use client"

import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trip } from "@/app/types/trip"
import Map from "@/components/map"
import SortableItinerary from "./SortableItinerary"

export default function MultiView(props: Trip) {

  const days =
    props.startDate && props.endDate
      ? Math.round(
          (new Date(props.endDate).getTime() - new Date(props.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="overview">
        <div className="flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="iternary">Iternary</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
          <Link href={`/trips/${props.id}/itinerary/new`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Add Location
            </Button>
          </Link>
        </div>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Trip Summary</CardTitle>
              <CardDescription>
                  <Calendar size={17}/>
                  <p className="flex justify-center">
                    {props.startDate && props.endDate
                      ? `length of trip: ${days} ${days === 1 ? "day" : "days"}`
                      : "length of trip: N/A"}
                  </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Destinations</span>
              </div>
              {props.locations && props.locations.length > 0 ? (
                <>
                  <ul className="space-y-1 mb-4">
                    {props.locations.map((location) => (
                      <li key={location.id} className="text-sm">
                        {location.locationTitle}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-md overflow-hidden">
                    <Map locations={props.locations} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No locations added yet.</p>
              )}
            </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iternary">
          <Card>
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
              <CardDescription>
                your trip locations in order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SortableItinerary
                locations={props.locations || []}
                onReorder={(newLocations) => {
                  console.log("reordered:", newLocations)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Map</CardTitle>
              <CardDescription>
                view your trip locations on the map
              </CardDescription>
            </CardHeader>
            <CardContent>
              {props.locations && props.locations.length > 0 ? (
                <div className="rounded-md overflow-hidden">
                  <Map locations={props.locations} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">no locations to display</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
