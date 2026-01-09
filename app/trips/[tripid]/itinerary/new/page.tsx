import NewLocationClient from "@/components/ui/new-location";

export default async function NewLocation({ params }: { params: Promise<{ tripid: string }> }) {
    const { tripid } = await params;
    return <NewLocationClient tripId={tripid} />;
}
