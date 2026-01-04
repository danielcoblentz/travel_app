import {prisma} from "../primsa";
import {redirect} from "next/navigation";
export async function createTrip(formData) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Not authenticated");
    }
// title, descirption, start, end, image url
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const startDateStr = formData.get("startdate")?.toString();
    const endDateStr = formData.get("enddate")?.toString();

    if (!title || !description || !startDateStr || !endDateStr ) {
        throw new Error("All fields are required.")
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    await prisma.trip.create({
        data:
            title,
            description,
            imageUrl,
            startDate,
            endDate,
            userId: session.url.id
    });

    redirect("/trips");

}