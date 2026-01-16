import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const sampleTrips = [
  {
    title: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-25"),
    locations: [
      { locationTitle: "Shibuya Crossing", lat: 35.6595, lng: 139.7004 },
      { locationTitle: "Tokyo Tower", lat: 35.6586, lng: 139.7454 },
      { locationTitle: "Senso-ji Temple", lat: 35.7148, lng: 139.7967 },
    ],
  },
  {
    title: "European Getaway",
    destination: "Paris, France",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-06-15"),
    locations: [
      { locationTitle: "Eiffel Tower", lat: 48.8584, lng: 2.2945 },
      { locationTitle: "Louvre Museum", lat: 48.8606, lng: 2.3376 },
      { locationTitle: "Notre-Dame", lat: 48.853, lng: 2.3499 },
    ],
  },
  {
    title: "Australian Outback",
    destination: "Sydney, Australia",
    startDate: new Date("2024-09-10"),
    endDate: new Date("2024-09-20"),
    locations: [
      { locationTitle: "Sydney Opera House", lat: -33.8568, lng: 151.2153 },
      { locationTitle: "Bondi Beach", lat: -33.8915, lng: 151.2767 },
      { locationTitle: "Harbour Bridge", lat: -33.8523, lng: 151.2108 },
    ],
  },
  {
    title: "Brazilian Carnival",
    destination: "Rio de Janeiro, Brazil",
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-18"),
    locations: [
      { locationTitle: "Christ the Redeemer", lat: -22.9519, lng: -43.2105 },
      { locationTitle: "Copacabana Beach", lat: -22.9711, lng: -43.1823 },
      { locationTitle: "Sugarloaf Mountain", lat: -22.949, lng: -43.1545 },
    ],
  },
  {
    title: "Safari Adventure",
    destination: "Nairobi, Kenya",
    startDate: new Date("2024-07-05"),
    endDate: new Date("2024-07-15"),
    locations: [
      { locationTitle: "Maasai Mara", lat: -1.4061, lng: 35.0168 },
      { locationTitle: "Nairobi National Park", lat: -1.3733, lng: 36.858 },
    ],
  },
  {
    title: "Iceland Northern Lights",
    destination: "Reykjavik, Iceland",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-10"),
    locations: [
      { locationTitle: "Blue Lagoon", lat: 63.8804, lng: -22.4495 },
      { locationTitle: "Golden Circle", lat: 64.3271, lng: -20.1199 },
      { locationTitle: "Reykjavik City", lat: 64.1466, lng: -21.9426 },
    ],
  },
  {
    title: "New York City Trip",
    destination: "New York, USA",
    startDate: new Date("2024-04-20"),
    endDate: new Date("2024-04-27"),
    locations: [
      { locationTitle: "Times Square", lat: 40.758, lng: -73.9855 },
      { locationTitle: "Central Park", lat: 40.7829, lng: -73.9654 },
      { locationTitle: "Statue of Liberty", lat: 40.6892, lng: -74.0445 },
    ],
  },
  {
    title: "Thailand Beach Holiday",
    destination: "Phuket, Thailand",
    startDate: new Date("2024-11-15"),
    endDate: new Date("2024-11-25"),
    locations: [
      { locationTitle: "Patong Beach", lat: 7.8965, lng: 98.2961 },
      { locationTitle: "Big Buddha", lat: 7.8278, lng: 98.3133 },
      { locationTitle: "Phi Phi Islands", lat: 7.7407, lng: 98.7784 },
    ],
  },
];

async function main() {
  // Get the first user (or you can specify a user ID)
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("No user found. Please sign in first to create a user.");
    return;
  }

  console.log(`Adding sample trips for user: ${user.email || user.id}`);

  for (const tripData of sampleTrips) {
    const trip = await prisma.trip.create({
      data: {
        title: tripData.title,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        userId: user.id,
        locations: {
          create: tripData.locations.map((loc, index) => ({
            locationTitle: loc.locationTitle,
            lat: loc.lat,
            lng: loc.lng,
            order: index,
          })),
        },
      },
    });
    console.log(`Created trip: ${trip.title}`);
  }

  console.log("Sample trips added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
