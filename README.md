# Portfolio Platform

A complete, working personal portfolio platform for a Cybersecurity / AI / Software
Engineering professional — a **dark, premium public portfolio** paired with a
**light, fully functional admin CMS** that controls every part of it. No part of
the public site is hardcoded content; everything comes from the database and is
editable from `/admin`.

➡️ **First time here? Start with [`SETUP.md`](./SETUP.md)** for step-by-step
install, database, and deployment instructions.

## What's real vs. simplified

This was built to actually run, not just look right. Everything below is real,
working, and was tested end-to-end in this delivery:

- Real authentication (bcrypt + database-backed sessions + brute-force lockout)
- Real CRUD for every content type, with real Zod validation
- Real image/PDF upload to disk, tracked in a real media library table
- Real contact form → real database row → real admin inbox
- Real reordering (up/down), visibility toggles, publish/draft states
- Real EN/AR bilingual content with real RTL layout switching
- Real SEO metadata generated from the database (title, OG tags, canonical, etc.)

A few things were intentionally simplified — see **"What's simplified"** below
and in `SETUP.md`. None of them are placeholders like "TODO" or "coming soon";
they're documented, working starting points for you to extend.

### Two important substitutions from the original spec

1. **ORM: Drizzle instead of Prisma.** The environment this was built in could
   not reach `binaries.prisma.sh` (Prisma's query engine download host), so
   Prisma's CLI could not actually run here. Drizzle ORM + `better-sqlite3`
   was used instead — it's pure TypeScript, needs no native engine binary,
   and is a widely-used, production-grade alternative (it's what Vercel's own
   starter templates use). The schema in `db/schema.ts` maps directly to a
   relational Postgres schema; moving to Postgres is a driver swap in
   `db/client.ts`, not a redesign. See `SETUP.md`.

2. **Database: SQLite locally instead of requiring Postgres up front.** You
   can run the whole app with zero external services. Moving to Postgres for
   production is documented and is a small, mechanical change.

## What's simplified (and how to extend it)

- **Cloud storage (S3 / Vercel Blob / Cloudinary):** the storage abstraction
  layer (`lib/storage/`) is fully designed for this, and local filesystem
  storage is fully implemented and works today. The cloud adapters throw a
  clear error telling you which file to write, because they need real
  credentials this environment doesn't have. See `SETUP.md`.
- **Reordering:** implemented as up/down arrow buttons rather than
  drag-and-drop. Fully functional, just less visually flashy.
- **Rich text editor:** a real, working `contentEditable`-based editor with a
  working toolbar (bold, italic, headings, lists, links, quotes, code,
  alignment) — not a full framework like TipTap, to keep the dependency
  footprint small.
- **Version history / rollback:** draft vs. published states exist per
  project/certificate, and there's a site-wide "published version" counter,
  but full per-field diff/rollback history is not implemented.
- **Live preview:** implemented as a real-time preview panel next to the
  Project editor (not a separate split-screen system across every editor).
- **2FA:** the database schema has the fields for it; the login flow does not
  enforce it yet.
- **Analytics dashboard:** page/project/certificate views are recorded to a
  real `analytics_events` table, but there's no charts/dashboard UI reading
  from it yet — the data is there for you to build on.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Drizzle ORM + SQLite (`better-sqlite3`) — Postgres-ready
- Framer Motion, Lucide React
- Zod validation
- Self-hosted fonts via `@fontsource` (Space Grotesk, Inter, JetBrains Mono,
  IBM Plex Sans Arabic) — no external font CDN dependency

## Project structure

```
app/
  [locale]/            → public site (en / ar), all pages
  admin/
    login/              → admin login (public)
    (protected)/        → everything behind auth: dashboard, CMS pages
  api/
    upload/              → file upload endpoint
    media/                → media delete endpoint
components/
  public/                → public site UI
  admin/                  → admin CMS UI
lib/
  auth/                   → password hashing, sessions, login
  actions/admin/           → server actions (all CRUD)
  data/                     → read queries (public + admin)
  storage/                  → storage abstraction layer
  i18n/                      → locale config, dictionaries
  validation/                 → Zod schemas
db/
  schema.ts                   → full Drizzle schema
  client.ts                    → DB connection (swap driver here for Postgres)
  seed.ts                       → seed script
```

## Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Then visit `http://localhost:3000` (redirects to `/en`) and
`http://localhost:3000/admin/login`.

Full details, including the default admin credentials, are in `SETUP.md`.
