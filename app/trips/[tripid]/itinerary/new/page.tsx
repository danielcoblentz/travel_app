import React from "react";

export default async function NewLocation({ params }: { params: { tripid: string } }): Promise<JSX.Element> {
    const { tripid } = params;
    return <NewLocationClient tripId={tripId} />;
}