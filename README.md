# WedGuru 💍

**Your wedding command center.** A full-stack wedding planning SaaS built with React, TypeScript, and Vercel serverless functions. Couples get one calm, beautiful hub for checklists, budgets, guests, seating, photo walls, themes, and an AI planner — all behind a shared invite link.

---

## Features

| Module | What it does |
|--------|-------------|
| **Smart Checklist** | Phase-aware task timeline auto-generated from your wedding date |
| **Budget Control** | Track spend across 11 categories with a real-time donut chart |
| **Guest Management** | Invite via magic link, RSVP tracking, CSV export |
| **Seating Planner** | Drag-and-drop table assignments with conflict detection |
| **Photo Wall** | Shared album for the wedding party — upload via Cloudinary |
| **Theme Explorer** | Curated mood boards with colour palettes and visual references |
| **AI Planner** | OpenAI-powered assistant for vendors, timelines, and budgets |

---

## Tech Stack

**Frontend**
- React 19 + TypeScript 6
- Vite 8 with `@tailwindcss/vite` (Tailwind v4)
- Framer Motion — page transitions and micro-animations
- shadcn/ui component primitives (Button, Card, Badge, Input, Textarea, Label, Separator)
- Lucide React icons
- Recharts for budget visualisation
- React Router v6

**Backend**
- Vercel Serverless Functions (`/api/*`)
- MongoDB + Mongoose (hosted on Atlas)
- JWT authentication with HTTP-only cookies
- Cloudinary for photo storage
- Zod for request validation
- bcryptjs for password hashing

---

## Project Structure

```
wedguru/
├── api/                        # Vercel serverless functions
│   ├── auth/
│   │   ├── login.ts
│   │   ├── me.ts
│   │   └── register.ts
│   ├── budget/
│   │   ├── index.ts            # GET list / POST create
│   │   └── [id].ts             # GET / PATCH / DELETE single
│   ├── checklist/
│   ├── guests/
│   ├── invite/
│   ├── photos/
│   └── wedding/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   └── textarea.tsx
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── api.ts              # Typed fetch helpers
│   │   ├── types.ts
│   │   ├── utils.ts            # cn() utility
│   │   ├── checklist-templates.ts
│   │   └── theme-ideas.ts
│   ├── pages/
│   │   ├── Landing.tsx         # Multi-section marketing page
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Checklist.tsx
│   │   ├── Budget.tsx
│   │   ├── Guests.tsx
│   │   ├── Seating.tsx
│   │   ├── PhotoWall.tsx
│   │   ├── Themes.tsx
│   │   ├── AiPlanner.tsx
│   │   └── Invite.tsx
│   ├── styles/
│   │   └── globals.css         # Tailwind v4 @theme tokens + BEM landing styles
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── tailwind.config.ts
├── vite.config.ts
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Cloudinary](https://cloudinary.com) account
- A [Vercel](https://vercel.com) account (for deployment)

### 1. Clone and install

```bash
git clone https://github.com/your-org/wedguru.git
cd wedguru
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wedguru

# Auth
JWT_SECRET=your-jwt-secret-min-32-chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=wedguru_unsigned_preset

# Vite (client-side)
VITE_API_URL=/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=wedguru_unsigned_preset
```

### 3. Run locally

```bash
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:3000`. To run the serverless functions locally, use the Vercel CLI:

```bash
npx vercel dev
```

### 4. Build for production

```bash
npm run build
```

---

## Deployment

WedGuru is designed to deploy on **Vercel** in one command:

```bash
npx vercel --prod
```

Set the environment variables above in your Vercel project dashboard under **Settings → Environment Variables**.

The `api/` directory is automatically recognised as Vercel Serverless Functions. No additional configuration is needed.

---

## Design System

WedGuru uses a custom **love / rose palette** built on Tailwind v4 `@theme` tokens:

| Token | Hex | Usage |
|-------|-----|-------|
| `rose-400` | `#e89ab8` | Borders, icons, accents |
| `rose-500` | `#d67ba0` | Primary interactive colour |
| `love-700` | `#6e304f` | Deep plum — headings, logos |
| `love-900` | `#2d1b33` | Body text |

**Glassmorphism** is applied in three tiers:
- `.glass` — feature cards, testimonials, general panels (`blur(18px)`)
- `.glass-love` — hero dashboard card, contact form (`blur(24px)` + love-tinted gradient)
- `.glass-pill` — floating hero badges (`blur(16px)` + white highlight inset)

**Typography**
- Display: `Newsreader` (serif) — headlines, section titles
- Body: `DM Sans` (sans-serif) — all body copy and UI

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | TypeScript check + production Vite build |
| `npm run lint` | ESLint across all TS/TSX files |
| `npm run preview` | Preview production build locally |

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Login, sets cookie |
| `GET` | `/api/auth/me` | ✓ | Current user |
| `GET/POST` | `/api/budget` | ✓ | List / create budget items |
| `GET/PATCH/DELETE` | `/api/budget/[id]` | ✓ | Single budget item |
| `GET/POST` | `/api/checklist` | ✓ | List / create checklist tasks |
| `GET/PATCH/DELETE` | `/api/checklist/[id]` | ✓ | Single task |
| `GET/POST` | `/api/guests` | ✓ | List / invite guests |
| `GET/PATCH/DELETE` | `/api/guests/[id]` | ✓ | Single guest |
| `GET` | `/api/invite/[token]` | — | Resolve invite token |
| `GET/POST` | `/api/photos` | ✓ | List / upload photos |
| `GET/PATCH` | `/api/wedding` | ✓ | Wedding profile |
