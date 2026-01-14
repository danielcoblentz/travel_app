"use client";
import { useRef, useEffect } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";


//boiler plate from docs @ react-globe.gl
export default function GlobePage() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;

        }
    }, []);
   
    // main content
    return (
        <div className="min-h-screen bg-gradient-to-b to-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-4xl font-bold mb-12">
                        Your Travel Journey
                    </h1>
                </div>

                <div className="flex justify-center">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-center">
                                See where you've been
                            </h2>

                            <div className="h-[600px] w-[800px] relative flex items-center justify-center">
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
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}