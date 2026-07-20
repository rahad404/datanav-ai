# DataNav AI — Frontend

A full-stack data analysis platform that lets users upload datasets (CSV, XLSX, JSON), get AI-powered analysis, visualize insights, and ask questions via an in-app chat assistant.

Built with **Next.js 16**, **Tailwind CSS v4**, **shadcn/ui**, and **Better Auth**.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 | React meta-framework (App Router) |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first CSS + component library |
| Auth | Better Auth | Session-based authentication (credentials + Google OAuth) |
| Data Fetching | TanStack React Query v5 | Server state management, caching, polling |
| Forms | React Hook Form + Zod | Form validation |
| Charts | Recharts | Interactive data visualizations |
| Carousel | Embla Carousel | Landing page testimonial carousel |
| Icons | Lucide React | Icon library |
| Rich UI | Radix UI Primitives | Accessible headless components |
| Toast | Sonner | Toast notifications |
| Animation | tw-animate-css | Tailwind animation utilities |
| Theming | next-themes | Dark/light theme toggle |
| Build | TypeScript compiler | Type checking |

---

## Features

- **Upload & Analyze** — Upload CSV, XLSX, or JSON files and get AI-generated analysis (KPIs, trends, risks, recommendations)
- **Explore Reports** — Browse publicly shared reports with full-text search, category filters, and pagination
- **Personal Dashboard** — View your uploaded reports, track analysis status, and manage your data
- **AI Chat Assistant** — Ask questions about your data, get context-aware answers, and receive follow-up suggestions
- **Report Details** — In-depth view with summary, trends, KPIs, risk assessment, and recommendations
- **Analysis Workspace** — Full-page analysis viewer with PDF export
- **Authentication** — Sign up / sign in via email/password or Google OAuth with Better Auth
- **Admin Panel** — User management for admin accounts
- **Responsive Design** — Works on desktop and mobile
- **Dark Mode** — Toggle between light and dark themes

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features, testimonials, CTA |
| `/login` | Sign in with email or Google |
| `/signup` | Create an account |
| `/forgot-password` | Reset password flow |
| `/dashboard` | Personal dashboard — your reports and stats |
| `/explore` | Browse public reports (search, filter, paginate) |
| `/reports/[id]` | Report detail with analysis, KPIs, trends, risks |
| `/reports/[id]/analysis` | Full-page analysis workspace (PDF export) |
| `/items/manage` | Manage your uploaded reports |
| `/items/add` | Upload a new dataset |
| `/profile` | Edit profile (name, image) |
| `/about` | About the platform |
| `/contact` | Contact form |
| `/help` | FAQ and support links |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/admin` | Admin panel (user management) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- Backend API server running (see [datanav-ai-server](../datanav-ai-server))

### 1. Clone & Install

```bash
git clone <repo-url>
cd datanav-ai
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Better Auth secrets (generate random strings)
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional — for Google sign-in)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 3. Run

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── about/              # /about
│   ├── admin/              # /admin
│   ├── api/                # Better Auth API route
│   ├── contact/            # /contact
│   ├── dashboard/          # /dashboard
│   ├── explore/            # /explore
│   ├── forgot-password/    # /forgot-password
│   ├── help/               # /help
│   ├── items/
│   │   ├── add/            # /items/add
│   │   └── manage/         # /items/manage
│   ├── login/              # /login
│   ├── privacy/            # /privacy
│   ├── profile/            # /profile
│   ├── reports/
│   │   └── [id]/           # /reports/:id, /reports/:id/analysis
│   ├── signup/             # /signup
│   ├── terms/              # /terms
│   ├── globals.css         # Theme & global styles
│   ├── layout.tsx          # Root layout (providers, nav, footer)
│   └── page.tsx            # Landing page
├── components/
│   ├── chat/               # ChatWidget (floating AI assistant)
│   ├── shared/             # StatusBadge, CategoryBadge, KpiCard, RiskBadge, etc.
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Input, etc.)
│   └── ...provider.tsx     # Theme & query providers
└── lib/
    ├── api.ts              # API client (request, authRequest, buildUrl)
    ├── auth-client.ts      # Better Auth client config
    ├── auth.ts             # Better Auth server config
    ├── types.ts            # Shared TypeScript types
    └── utils.ts            # cn() helper
```

---

## Deployment

The frontend is designed to deploy on **Vercel**.

```bash
npm run build
```

Set the same environment variables in your Vercel project dashboard (`.env` values are local-only).

---

## License

MIT
