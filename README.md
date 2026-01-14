# Travel Booking App

A fullstack travel booking application with hotel and flight reservations, role-based access control, and trip management.

## Features

- **Trip Management**: Create trips with destinations, dates, and images
- **Location Tracking**: Add locations to trips with automatic geocoding via Google Maps API
- **Hotel Reservations**: Browse, search, and book hotels tied to trips
- **Flight Reservations**: Search and book flights for trips
- **Role-Based Access**: Toggle between User and Owner roles
  - Users: Browse listings, manage cart, book to trips
  - Owners: Create and manage hotel listings, view bookings
- **Interactive Globe**: 3D visualization of all visited locations
- **Shopping Cart**: Add hotels/flights to cart before booking to specific trips

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with GitHub provider
- **Maps**: Google Maps API, react-globe.gl
- **UI Components**: shadcn/ui

## Project Structure

```
app/
  actions/       # server actions (add-location, geocode)
  api/           # REST API routes (hotels, flights, cart, bookings)
  components/    # react components (TripCard, NavBar, Map, etc)
  types/         # typescript type definitions
  [pages]/       # route pages (hotels, flights, cart, owner, globe)
components/
  ui/            # shadcn/ui primitives
prisma/
  schema.prisma  # database schema
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
GOOGLE_MAPS_API_KEY=your-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

3. Push database schema:
```bash
npx prisma db push
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

## Role-Based Access

Click the role badge in the navbar to toggle between User and Owner modes:
- **User mode**: Browse and book hotels/flights to your trips
- **Owner mode**: Access owner dashboard to create hotel listings and view bookings
