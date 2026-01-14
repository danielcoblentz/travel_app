import NewLocationForm from "@/app/components/NewLocationForm";

export default async function NewLocation({ params }: { params: Promise<{ tripid: string }> }) {
    const { tripid } = await params;
    return <NewLocationForm tripId={tripid} />;
}
