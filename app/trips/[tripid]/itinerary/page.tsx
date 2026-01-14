"use client"

import { use } from "react"
import NewLocationClient from "./NewLocationClient"

export default function NewLocation({params}: {params: Promise<{tripId: string}>}) {
    const {tripId} = use(params)

    return <NewLocationClient tripId={tripId} />
}