"use client";
import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export interface transformedLocation {
    lat: number;
    lng: number;
    country: string;
    name: string;
}


export default function GlobePage() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);


    const [locations, SetLocations] = useState<transformedLocation[]>([])
    const [isLoading,SetIsLoading] = useState(true);
    
    const[vistiedCountries, setVisitedCountries] = useState<Set<string>>(new Set())
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch("/api/pins")
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();

                const countries = new Set<string>(data.map((loc: transformedLocation ) => loc.country))
                setVisitedCountries(countries)
                SetLocations(data);
            }
            catch (err) {
                console.error("error", err);
            }
            finally {
                SetIsLoading(false);
            }
        }
        fetchLocations();
    }, []);

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }

    }, []);

    return (
        
        <div className="min-h-screen bg-gradient-to-b to-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-4xl font-bold mb-12">
                        Your Travel Journey
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-start gap-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-center">
                                See where you've been
                            </h2>

                            <div className="h-[600px] w-[800px] relative flex items-center justify-center">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <Globe
                                        ref={globeRef}
                                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                                        showAtmosphere={true}
                                        atmosphereColor="lightskyblue"
                                        atmosphereAltitude={0.25}
                                        width={800}
                                        height={600}
                                        pointLabel="name"
                                        pointsData={locations}
                                        pointsMerge={true}
                                        pointAltitude={0.1}
                                        pointColor={() => "#FE8D01"}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-80">
                        <Card className="sticky top-8">
                            <CardHeader> <CardTitle>Your Trips</CardTitle></CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                        {locations.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No trips added yet</p>
                                        ) : (
                                            locations.map((location, index) => (
                                                <div key={index} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                                    <MapPin className="h-4 w-4 text-red-500"/>
                                                    <span className="font-medium">{location.name}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}