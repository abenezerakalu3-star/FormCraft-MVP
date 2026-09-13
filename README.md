# FormCraft — Self-hosted Form Builder

A simple, self-hosted form builder SaaS. Create forms with a visual builder, share
them via a public link, and view submissions in a dashboard.

## Features

- User accounts (register / login)
- Visual form builder with 8 field types: short text, paragraph, email, number,
  date, dropdown, multiple choice, checkboxes
- Reorder, delete, and require fields; options defined one per line
- Publish / unpublish with a unique public link per form
- Public submission page with server-side validation on required fields,
  email format, and allowed options
- Submissions dashboard with a per-field response table

## Stack

- Next.js 16 (App Router), React 19, Tailwind CSS 4
- PostgreSQL via Prisma (works with Neon, Supabase, Railway, RDS)
- JWT session auth (`jose`), passwords hashed with `bcryptjs`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

- `DATABASE_URL` — your PostgreSQL connection string (e.g. from Neon)
- `SESSION_SECRET` — generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_APP_URL` — your public URL (used for absolute share links)

### 3. Create the database schema

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and
build your first form.

## Project layout

```
app/
  api/                  # REST endpoints (auth, forms, fields, submissions)
  dashboard/            # logged-in app (form list, builder, submissions)
  form/[slug]/          # public form page
  login|register/       # auth pages
lib/
  auth.ts               # session create/verify/require
  passwords.ts          # bcrypt hashing
  validate.ts           # zod schemas
  fields.ts             # field types + helpers
prisma/schema.prisma    # User, Form, Field, Submission models
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, import the repo and set the env vars (`DATABASE_URL`,
   `SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`).
3. Deploy — the `postinstall` script runs `prisma generate` automatically.