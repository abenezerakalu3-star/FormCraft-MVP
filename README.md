# Formitect — Build forms in minutes, collect answers that matter

Formitect is a modern, self-hosted form builder SaaS built on **Next.js 16**. You
create a form with a drag-and-drop style visual builder, publish it to a public
link, and watch responses stream into a clean analytics dashboard — no code,
no fees, no limits. Supporting documents like CVs and Student IDs are stored in
**AletCloud S3** (Ethiopian sovereign cloud), so sensitive uploads never leave
the country.

---

## Why Formitect matters

- **Free forever for creators.** Anyone can collect unlimited forms and
  responses without a credit card. No paywall to start, no surprise upgrade.
- **Your data stays in Ethiopia.** Files are stored on AletCloud's Object
  Storage, which runs inside Ethio Telecom's Bole data center — traffic stays
  in-country instead of detouring through Europe.
- **Every device, by default.** The whole app is fully responsive — mobile,
  tablet, laptop, and desktop. People fill forms on their phones; creators
  manage them from anywhere.
- **Professional out of the box.** SEO, social share images, PWA manifest,
  sitemap, analytics, exports (CSV/Excel/PDF), and a clean admin console ship
  with the product — not as paid add-ons.
- **Support the maker directly.** A Buy Me a Coffee button and floating widget
  let happy users support development — an honest, community-first business
  model instead of restricting features behind subscriptions.

## Features

### For form creators

- **Visual form builder** — 9 field types in one click: short text, paragraph,
  email, number, date, dropdown, multiple choice, checkboxes, and file upload.
- **Field settings** — label, require/optional toggle, options (one per line),
  duplicate, reorder (drag or buttons), and delete.
- **Publish anytime** — one click flips a form live with a unique share link;
  unpublish to stop new responses instantly.
- **Live preview & copy** — see a mock preview of each field while editing and
  copy the public link straight from the toolbar.

### For respondents

- **Beautiful public page** — a clean, responsive form that works great on
  phones, with a success celebration after submitting.
- **Server-side validation** — required fields, email format, allowed options,
  and file types are all enforced safely, not just visually.
- **Secure file uploads** — CVs, Student IDs, and other documents upload to
  AletCloud S3 and are served through short-lived signed links (up to 10 MB).

### Analytics, exports & submissions

- **Per-form analytics** — daily views over time rendered as charts.
- **Response dashboard** — a table view of every submission per field, with
  image thumbnails and direct download buttons for uploaded files.
- **One-click exports** — download all responses as **CSV, Excel, or PDF**.
- **Response-rate insights** — every form card shows what % of visitors submit.

### Platform & polish

- **User dashboard** — time-aware greeting, stat cards (forms, responses,
  views, live forms), search, and live/draft filters.
- **Admin console** — user management, form management, blog content, contact
  inbox, and site settings behind role-based permissions.
- **Blog** — write and publish articles that sync into SEO sitemaps.
- **Authentication** — email/password (bcrypt) plus **Google sign-in (OAuth)**.
- **Site settings** — brandable site name, hero copy, announcement bar, and
  contact email editable from the admin panel.
- **Dark/light theme** — toggle included.

### SEO & discoverability

- Per-page metadata, canonical URLs, OpenGraph + Twitter cards, generated
  social share images, `sitemap.xml`, `robots.txt`, and a PWA manifest with
  favicons — so the product looks right in search and on home screens.

## Tech stack

| Area        | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 16 (App Router), React 19                 |
| Styling     | Tailwind CSS 4, lucide-react icons                |
| Database    | PostgreSQL via Prisma (Neon/Supabase/RDS)         |
| Auth        | JWT sessions (`jose`) + `bcryptjs` passwords, Google OAuth |
| Uploads     | AletCloud S3 via `@aws-sdk/client-s3` (presigned URLs) |
| Validation  | Zod                                               |
| Charts      | Lightweight client-side analytics charts          |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `DATABASE_URL` (PostgreSQL), `SESSION_SECRET`
(`openssl rand -base64 32`), and `NEXT_PUBLIC_APP_URL`. See
[Environment variables](#environment-variables) below for the full list.

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

## Environment variables

All variables live in `.env` (gitignored). Required:

| Variable                  | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string                  |
| `SESSION_SECRET`          | Signs auth sessions (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL`     | Public URL for absolute share links           |

Optional:

| Variable                  | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID (Continue with Google) |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret                    |
| `S3_ENDPOINT`             | AletCloud S3 endpoint (default `https://s3.aletcloud.com`) |
| `S3_REGION`               | S3 region (default `us-east-1`)               |
| `S3_BUCKET_NAME`          | Your bucket name (e.g. `t612-formitect`)      |
| `S3_ACCESS_KEY_ID`        | Bucket access key                             |
| `S3_SECRET_ACCESS_KEY`    | Bucket secret key                             |

If `S3_*` vars are absent, uploads fall back to local storage under
`public/uploads/`.

## Project layout

```
app/
  api/                  # REST endpoints (auth, upload, files, submissions, admin)
  admin/                # admin console (users, forms, blog, messages, settings)
  dashboard/            # logged-in app (stats, forms, builder, overview, submissions, profile)
  form/[slug]/          # public form page
  blog/                 # public blog
  login|register/       # auth pages
components/
  motion/               # scroll + stagger animation helpers
  admin/                # admin nav and panels
prisma/schema.prisma    # User, Form, Field, Submission, BlogPost, Message models
lib/
  auth.ts               # session create/verify/require
  s3.ts                 # AletCloud S3 client + presigned URLs
  upload (route)        # validates + stores uploads (S3 or local)
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, import the repo and set the required env vars (see
   [Environment variables](#environment-variables)).
3. Deploy — the `postinstall` script runs `prisma generate` automatically.

## Scripts

| Command              | What it does                    |
| -------------------- | ------------------------------- |
| `npm run dev`        | Start the dev server            |
| `npm run build`      | Production build                |
| `npm run start`      | Serve the production build      |
| `npm run lint`       | Run ESLint                      |
| `npm run db:push`    | Push the Prisma schema          |
| `npm run admin:create` | Create a super admin account  |

---

Built with care for creators, students, and teams who want to collect data —
fast, free, and close to home.