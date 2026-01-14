"use client"

import { use } from "react"

export default function newLocation({params}: {params: Promise<{tripId: string}>}): JSX.Element {
    const {tripId} = use(params)

    return <newLocationClient tripId={tripId} />
}