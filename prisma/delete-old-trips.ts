import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const sampleTitles = [
  "Tokyo Adventure",
  "European Getaway",
  "Australian Outback",
  "Brazilian Carnival",
  "Safari Adventure",
  "Iceland Northern Lights",
  "New York City Trip",
  "Thailand Beach Holiday",
];

async function main() {
  // First delete locations for old trips
  const deletedLocations = await prisma.location.deleteMany({
    where: {
      trip: {
        title: { notIn: sampleTitles },
      },
    },
  });
  console.log(`Deleted ${deletedLocations.count} old locations`);

  // Then delete the trips
  const deleted = await prisma.trip.deleteMany({
    where: {
      title: { notIn: sampleTitles },
    },
  });
  console.log(`Deleted ${deleted.count} old trips`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
