import { redirect } from "next/navigation";
import { auth } from "../auth";
import AddTrip from "../components/AddTrip";

export default async function NewTripPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <AddTrip />;
}
