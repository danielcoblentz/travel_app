import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import TripList from "../components/TripList";

export default function TripsPage() => {
    return (
        <div>
        <h1>Hello from trips!</h1>
        <TripList />
        
        </div>
    );
}



