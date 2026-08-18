# Gada Assembly - The Church of Pentecost

A modern, production-ready digital platform for The Church of Pentecost, Queen City District — Gada Assembly.

## Features

- **Public Website**: Homepage, About, Sermons, Events, Announcements, Prayer Requests, Contact
- **Member Platform**: Dashboard, Profile, Attendance, Giving, Prayer Requests
- **Admin Dashboard**: Full church management system with members, sermons, events, attendance, giving, reports, and settings
- **Mobile-First Design**: Responsive UI with bottom navigation for mobile users
- **Official Branding**: Church of Pentecost logo and flyer integrated

## Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React icons

### Backend
- Node.js + Express + TypeScript
- Supabase (PostgreSQL)
- JWT Authentication
- Role-based access control

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL in `server/src/config/schema.sql` in the Supabase SQL Editor
   - Copy your Supabase credentials

4. Configure environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Fill in your Supabase URL, anon key, and service role key

5. Seed the database:
   ```bash
   cd server
   npm run seed
   ```

6. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. Open `http://localhost:5173` in your browser

## Demo Accounts

- Admin: `admin@gadaassembly.org` / `admin123`
- Pastor: `pastor@gadaassembly.org` / `pastor123`
- Leader: `leader@gadaassembly.org` / `leader123`
- Member: `member1@gadaassembly.org` / `member123`

## Project Structure

```
gada-ass/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utilities and API client
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   ├── validators/     # Zod validation schemas
│   │   └── scripts/        # Seed scripts
│   └── .env                # Environment variables
└── package.json            # Root package.json
```

## License

Private - The Church of Pentecost, Queen City District — Gada Assembly
