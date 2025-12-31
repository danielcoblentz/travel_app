"use client"

import { useState } from "react"
import { AppWindowIcon, CodeIcon } from "lucide-react"
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

// we want 3 views overview, iternary and map w ligth white background to show its selected then render content based on that
export default function MultiView() {
  const [itinerary, setItinerary] = useState("")

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="iternary">Iternary</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                we will add the travel detils here later on this is a placeholder atm
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* display the itinerary here this is going to remain read-only */}
              {itinerary ? (
                <div className="whitespace-pre-wrap text-sm">{itinerary}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No itinerary yet.</div>
              )}
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
