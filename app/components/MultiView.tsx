"use client"

import { useState } from "react"
import Link from "next/link"
import { AppWindowIcon, CodeIcon, Calendar, MapPin, } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trip } from "@/app/types/trip";

type Props = Trip;
// we want 3 views overview, iternary and map w ligth white background to show its selected then render content based on that
export default function MultiView(Props: Props) {
  const [itinerary, setItinerary] = useState("")

  const days =
    Props.startDate && Props.endDate
      ? Math.round(
          (new Date(Props.endDate).getTime() - new Date(Props.startDate).getTime()) /
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
          <Link href={`/trips/${Props.id}/itinerary/new`}>
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
                    {Props.startDate && Props.endDate
                      ? `length of trip: ${days} ${days === 1 ? "day" : "days"}`
                      : "length of trip: N/A"}
                  </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
              {/* display the itinerary here this is going to remain read-only */}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Destinations</span>
              </div>
              {Props.locations && Props.locations.length > 0 ? (
                <ul className="space-y-1">
                  {Props.locations.map((location) => (
                    <li key={location.id} className="text-sm">
                      {location.locationTitle}
                    </li>
                  ))}
                </ul>
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
              <CardTitle>Iternary</CardTitle>
              <CardDescription>add something here</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current iternary</Label>
                {/* TODO: controlled textarea so user can enter itinerary of items to do need a way to save this to DB currently saved locally*/}
                <textarea
                  id="tabs-demo-current"
                  value={itinerary}
                  onChange={(e) => setItinerary(e.target.value)}
                  className="w-full min-h-[6rem] border px-2 py-1 rounded"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {}}>Save iternary</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/*need to add the google maps view here (TODO) */}
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Map</CardTitle>
              <CardDescription>
                Make changes to your overview here. Click save when you&apos;re
                done
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Username</Label>
                <Input id="tabs-demo-username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
