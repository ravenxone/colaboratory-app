# USC Colaboratory

A collaboration platform for USC students to post projects and find teammates with specific skill sets.

## Features

- **Authentication**: USC email (@usc.edu) only authentication via Supabase Auth
- **Project Board**: Browse all open projects with search and role filtering
- **Project Details**: View project descriptions, videos, user problems, and poster credentials
- **Collaboration Requests**: Students can submit requests to collaborate with project posters
- **Post Projects**: Create new project listings with validation (user interviews required)
- **Dashboard**: View your projects and manage collaboration requests

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel

## Getting Started

### 1. Clone the repository

```bash
cd colaboratory-app
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema in `supabase-schema.sql` in the Supabase SQL Editor
3. Copy your project URL and anon key

### 3. Configure environment variables

Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install dependencies

```bash
npm install
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

- **profiles**: User profiles (linked to auth.users)
- **projects**: Project listings with details, video URLs, and user validation
- **collaboration_requests**: Collaboration requests from students to project posters

See `supabase-schema.sql` for the complete schema with Row Level Security policies.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The app is optimized for Vercel's platform with:
- Server-side rendering for SEO
- Edge middleware for auth
- Automatic optimization

## Project Structure

```
colaboratory-app/
├── app/
│   ├── dashboard/      # User dashboard
│   ├── login/          # Login page
│   ├── post/           # Post new project
│   ├── projects/[id]/  # Project detail page
│   ├── signup/         # Signup page
│   └── page.tsx        # Home page (project board)
├── components/
│   ├── Dashboard.tsx
│   ├── Navbar.tsx
│   ├── PostProjectForm.tsx
│   ├── ProjectBoard.tsx
│   └── ProjectDetail.tsx
├── lib/
│   ├── database.types.ts
│   └── supabase/
│       ├── client.ts
│       ├── middleware.ts
│       └── server.ts
└── supabase-schema.sql
```

## Key Features Implementation

### Authentication
- Email/password auth with Supabase
- Domain restriction to @usc.edu emails
- Protected routes via middleware

### Project Board
- Dynamic role filters (default + custom roles)
- Real-time search
- YC-style layout

### Project Posting
- User validation checkbox
- Video URL support (YouTube/Loom)
- Custom role creation
- User problem description required

### Collaboration Flow
- Skills selection via checkboxes
- Contact info collection
- Requests stored in database (not emailed)
- Poster views all requests in dashboard

## License

MIT
