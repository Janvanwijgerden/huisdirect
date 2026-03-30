# Huisje 🏡

A modern real estate platform built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Supabase**. A simplified, production-ready alternative inspired by Funda.

---

## Features

- 🔐 Authentication (sign up, sign in, sign out) via Supabase Auth
- 🏠 Create, view, and delete property listings
- 🔍 Browse & filter listings by city and property type
- 📋 User dashboard with listing management
- ⭐ Featured listings on homepage
- 📱 Fully responsive design
- 🎨 Clean, editorial UI with Playfair Display + DM Sans

---

## Project Structure

```
huisje/
├── src/
│   ├── app/
│   │   ├── (main)/                  # Main layout (navbar + footer)
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx         # Listings overview
│   │   │   │   ├── [id]/page.tsx    # Listing detail
│   │   │   │   └── new/page.tsx     # Create listing
│   │   │   └── dashboard/page.tsx   # User dashboard
│   │   ├── auth/                    # Auth layout
│   │   │   ├── login/page.tsx       # Sign in
│   │   │   └── register/page.tsx    # Sign up
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── listings/
│   │       ├── ListingCard.tsx
│   │       ├── ListingGrid.tsx
│   │       └── SearchBar.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser client
│   │   │   ├── server.ts            # Server client
│   │   │   └── middleware.ts        # Session refresh
│   │   ├── actions/
│   │   │   ├── auth.ts              # Auth server actions
│   │   │   └── listings.ts          # Listing CRUD actions
│   │   └── utils.ts                 # Helpers (cn, formatPrice, etc.)
│   ├── types/
│   │   └── database.ts              # TypeScript types
│   └── middleware.ts                # Route protection
├── supabase/
│   └── schema.sql                   # Database schema + RLS policies
├── .env.local.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo>
cd huisje
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings → API**
3. Copy your **Project URL** and **anon public** key

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the database

1. In your Supabase dashboard, go to **SQL Editor**
2. Paste and run the contents of `supabase/schema.sql`
3. This creates:
   - `profiles` table (auto-populated on sign-up)
   - `listings` table with full RLS policies
   - Trigger to auto-create profile on user registration

### 5. (Optional) Enable image uploads

In your Supabase dashboard:
1. Go to **Storage → Create bucket**
2. Name it `listing-images`, set to **Public**
3. Uncomment the storage policies at the bottom of `schema.sql` and run them

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key Architectural Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Routing | App Router + Route Groups | Clean separation of layouts |
| Data fetching | Server Components + Server Actions | No extra API layer needed |
| Auth | Supabase Auth + SSR cookies | Secure, server-side session |
| Styling | Tailwind CSS + component classes | Fast, consistent, scalable |
| Protection | Next.js Middleware | Route-level auth guard |

---

## Extending the Platform

### Add image uploads
Use Supabase Storage in the new listing form:
```ts
const { data } = await supabase.storage
  .from('listing-images')
  .upload(`${userId}/${filename}`, file);
```

### Add favourites/saved listings
Create a `saved_listings` junction table and a heart button on each card.

### Add a map view
Integrate [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) or [Leaflet](https://leafletjs.com/) using geocoded addresses.

### Add pagination
Use Supabase's `.range(from, to)` for cursor-based pagination on the listings page.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Backend/DB/Auth**: [Supabase](https://supabase.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: Playfair Display + DM Sans (Google Fonts)
- **TypeScript**: Strict mode throughout

---

## License

MIT
