# Travel App

A travel planning application built with Next.js for organizing trips and itineraries.

## Features

- Create and manage trips with destinations, dates, and images
- Add locations to trips with automatic geocoding
- View trip locations on an interactive map
- Drag and drop itinerary reordering
- 3D globe visualization of visited places
- Search and filter trips

## Tech Stack

- Next.js 15 (App Router)
- Prisma ORM
- NextAuth for authentication
- Google Maps API
- Tailwind CSS
- shadcn/ui components

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
