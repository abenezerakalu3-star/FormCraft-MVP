# Formitect — Senior Engineering Audit

**Date:** 2026-09-16  
**Codebase state:** Local `main` branch, 3 commits ahead of `8d7c420` (animation features)

---

## 1. Executive Summary

Formitect is a self-hosted form-builder SaaS built on Next.js 16 + Prisma + SQLite/Postgres. Core functionality works end-to-end: registration, form creation, publishing, public submission, and a real admin panel. The UI is polished and consistent. However, there are critical security gaps (no rate limiting, SVG upload allowing stored XSS, hardcoded `SESSION_SECRET` fallback), no password reset, no email verification, no database backups, and no infrastructure hardening. It is **not production-ready as-is** but has a solid foundation for a v1 launch after addressing the P0 items below.

**Overall score: 45/100** (functional product, unsafe for public deployment)

---

## 2. Technology Stack

| Layer | Technology | Status |
|---|---|---|
| Framework | Next.js 16.3.5 (App Router, `experimental.authInterrupts`) | ✅ Real |
| Runtime | React 19.2.8 | ✅ Real |
| ORM | Prisma 6.25.6 | ✅ Real |
| Database | SQLite (default) / Postgres (env) | ✅ Real |
| Auth | Custom JWT (jose) httpOnly cookie, bcryptjs | ✅ Real |
| OAuth | Google OAuth 2.0 (conditional) | ✅ Real |
| Payments | None | ⚪ None |
| File storage | AletCloud S3 / local `public/uploads` fallback | ✅ Real |
| Charts | Recharts 3.10.3 | ✅ Real |
| Animations | Framer Motion 13.2.3 | ✅ Real |
| Icons | Lucide React | ✅ Real |
| PDF export | jsPDF + jspdf-autotable | ✅ Real |
| PWA | `manifest.ts` present, no service worker | 🟡 Partial |
| Email | None (no transactional email) | 🔴 Missing |
| Search | None | 🔴 Missing |

---

## 3. Feature Status

### Public
| Feature | Status | Notes |
|---|---|---|
| Marketing homepage | ✅ | Real DB stats, Product Hunt embed, animated hero |
| Blog listing + posts | ✅ | Admin CRUD, published-only, SEO metadata |
| Contact form | ✅ | Stored in DB, viewable in admin, no email notification |
| Privacy / Terms | ✅ | Content pages, admin-editable via settings |
| Registration | ✅ | Zod validated, bcrypt, duplicate email blocked |
| Login | ✅ | Email/password + Google OAuth (conditional) |
| OAuth error handling | ✅ | Maps `oauth_blocked`, `missing_code`, etc. to messages |
| Password reset | 🔴 | **Not implemented** |
| Email verification | 🔴 | **Not implemented** |

### Dashboard (User)
| Feature | Status | Notes |
|---|---|---|
| Overview page | ✅ | Real stats from DB |
| Create form | ✅ | Title input, template selection (mock data) |
| Form builder | ✅ | Full field CRUD, reorder, publish/unpublish, settings panel |
| Form preview | ✅ | Live preview in builder |
| Submissions table | ✅ | Paginated, file cell, CSV export |
| PDF export | ✅ | jsPDF table generation |
| Completion rate stat | 🔴 Bug | Hardcoded "100%" when any total exists (`submissions/page.tsx:119`) |
| Title/description save | 🔴 Bug | Only saved on publish toggle, not via field Save button |
| Warning banner | ✅ | Blocked users see warning |
| Logout | ✅ | Clears httpOnly cookie |
| Account deletion | ✅ | Server action, deletes user + all owned forms |
| Profile editing | ✅ | Name change, password change |
| Onboarding | 🔴 | No onboarding flow after registration |

### Admin Panel
| Feature | Status | Notes |
|---|---|---|
| Overview dashboard | ✅ | Real stats, Recharts (line, bar, pie), 14-day trend |
| Stat cards | ✅ | All from DB, wrapped in TiltCard |
| Users management | ✅ | List, search, filter, warn, block/unblock, clear warnings |
| Forms management | ✅ | List all forms, search, filter by status |
| Admin management | ✅ | Create admins, grant granular permissions, protect own access |
| Blog management | ✅ | Create/edit/delete posts, publish toggle, slug collision detection |
| Site settings | ✅ | Edit all settings inline, immediate save |
| Messages inbox | ✅ | View contact submissions, stat cards |
| Overview charts | ✅ | Line chart (responses & visitors), bar chart (users & forms), pie (form status) |
| Permission system | ✅ | Granular: forms, users, admins, blog, settings, messages |

### File Handling
| Feature | Status | Notes |
|---|---|---|
| File upload | ✅ | 10MB limit, type allowlist (SVG included) |
| S3 storage | ✅ | AletCloud S3 via AWS SDK |
| Local fallback | ✅ | `public/uploads/` when S3 not configured |
| File serving | ✅ | `/api/files?key=...` → S3 presigned redirect or local redirect |
| File validation (submission) | ✅ | Checks URL starts with `/uploads/` or `/api/files` |

---

## 4. What Actually Works

- **Form lifecycle**: Create → add fields → set required/optional → publish → get share link → collect submissions → view/export. Fully functional end-to-end.
- **Admin panel**: Real admin dashboard with charts, user/form/blog/message management, granular permissions. Not mock data.
- **Auth system**: JWT sessions with httpOnly cookies, bcrypt hashing, blocked-user session termination, Google OAuth with state parameter.
- **Theme system**: Light/dark toggle, OS preference detection, localStorage persistence.
- **SEO**: Metadata with OG tags, `robots.ts`, `sitemap.ts` (dynamic, includes blog posts), `manifest.ts`, canonical URLs.
- **Error pages**: Custom 404, 401, 403, 500 pages with proper UX.
- **Responsive design**: Mobile menu, responsive grids, mobile-first layouts.
- **Database**: Prisma schema is clean, well-typed, with proper relations.

---

## 5. What Does Not Work / Is Broken

1. **Completion rate hardcoded** (`submissions/page.tsx:119`): Shows "100%" whenever any submissions exist. Should be `(viewsWithSubmission / totalViews) * 100` or similar.
2. **Form title/description lost**: The Save button in the builder only saves fields. Title and description are only persisted when toggling publish. Editing title → clicking Save → title reverts on page reload.
3. **No password reset flow**: Users who forget their password have no recovery path.
4. **No email verification**: Anyone can register with any email address.
5. **No onboarding**: New users land on an empty dashboard with no guidance.
6. **No email notifications**: Contact form submissions and new form submissions generate no alerts.
7. **Template data is mock**: `form-templates.ts` contains `{ id: "mock-..." }` identifiers. Selecting a template loads a preset field list but template IDs are non-functional.
8. **Blog post rendering is plain text**: Content is split by `\n\n` and rendered as `<p>` tags. No markdown support, no code blocks, no images.
9. **Admin authority hardcoded**: "Your authority: Full" is always shown regardless of actual scoped permissions.
10. **Timestamp rendering**: Some Date formatting may produce truncated output in narrow table columns.

---

## 6. UI/UX Assessment

**Score: 82/100** — Professional and polished for an MVP.

**Strengths:**
- Consistent design system: `card`, `chip`, `btn-primary`, `btn-secondary`, `input-field` classes used everywhere
- Dark mode works well with CSS custom properties (`--bg`, `--surface`, `--foreground`, etc.)
- Smooth framer-motion animations: page transitions, hero parallax, stat counters, field stagger
- Mobile-responsive with hamburger menu
- Real-time form preview in builder
- Clean admin dashboard with charts and stat cards
- Proper empty states for every list/table

**Weaknesses:**
- No loading states on many form submissions (settings save, profile update)
- No confirmation dialogs for destructive actions (delete form, delete account) beyond the button click
- No keyboard shortcuts or accessibility landmarks beyond basic HTML semantics
- No `aria-label` on icon-only buttons
- Blog posts render as plain text (no rich formatting)

---

## 7. Security Assessment

### 🔴 Critical

1. **No rate limiting anywhere**: `/api/auth/login`, `/api/auth/register`, `/api/submissions`, `/api/contact`, `/api/upload` — all unlimited. An attacker can brute-force credentials, flood submissions, or spam the contact form. **No `middleware.ts` exists at all.**

2. **`SESSION_SECRET` fallback** (`lib/auth.ts:18`): `process.env.SESSION_SECRET || "dev-secret-change-me"`. If the env var is unset in production, all sessions use a publicly visible secret. JWTs can be forged.

3. **Stored XSS via SVG upload**: The upload route allows `.svg` files. SVGs can contain `<script>` tags. The `/api/files` route serves them with `Content-Disposition: inline`, meaning browsers render them as HTML — executing any embedded JavaScript. An attacker can upload a malicious SVG, link it in a form submission, and steal any user who views that submission.

### 🟠 High

4. **No CSRF protection**: No CSRF tokens on any mutation endpoint. The httpOnly cookie provides some mitigation, but state-changing POST/PATCH/DELETE/PUT routes lack CSRF tokens or `SameSite=Strict`. `SameSite=Lax` (current) protects against most cross-site attacks but not all.

5. **No Content Security Policy (CSP) headers**: No `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, or `Referrer-Policy` headers are set anywhere. The app can be framed by any site (clickjacking). XSS payloads have no containment.

6. **No HSTS**: No `Strict-Transport-Security` header. Downgrade attacks possible on HTTP.

7. **No database backups**: SQLite file has no backup strategy. Data loss risk on server failure.

8. **Local upload fallback stores files in `public/`**: When S3 is not configured, files are written to `public/uploads/`. These are served directly by Next.js static file serving with no access control.

### 🟡 Medium

9. **No password reset**: Users who forget their password are permanently locked out.

10. **No email verification**: Registration accepts any email. Account impersonation is trivial.

11. **No account lockout**: Failed login attempts don't increment or lock accounts.

12. **Google OAuth state cookie**: Uses `signed: true` and `httpOnly`, which is good, but the state parameter is a fixed 32-byte random value — sufficient for CSRF prevention during the OAuth flow.

13. **Prisma `findUnique` on `id`**: All ownership checks use `findFirst({ where: { id, userId } })`. This is correct — the `id` is a cuid, so enumeration is impractical. ✅

14. **File validation on submission**: The submission endpoint checks `file.url.startsWith("/uploads/") || file.url.startsWith("/api/files")`. This is a client-trusted check — the user can submit any URL. However, the file is only *displayed* (not re-downloaded), so impact is limited to reflected content, not server-side.

### 🟢 Low

15. **`SESSION_SECRET` hardcoded fallback is only a risk if unset**: If set, the app is secure against session forgery.

16. **No `.env.example` file**: New contributors may not know which env vars are required.

17. **No `security.txt` or vulnerability disclosure policy**.

---

## 8. Technical Debt

| Debt | Impact | Priority |
|---|---|---|
| No `middleware.ts` | No rate limiting, no global auth guards, no security headers | P0 |
| No CSP/security headers | XSS, clickjacking, MIME sniffing | P0 |
| SVG upload + inline serve | Stored XSS | P0 |
| `SESSION_SECRET` fallback | Session forgery if env unset | P0 |
| No password reset | User lockout, support burden | P0 |
| Hardcoded "100%" completion | Misleading metric | P1 |
| Title/description not saved on Save | Data loss confusion | P1 |
| No email verification | Account impersonation | P1 |
| No `.env.example` | Developer friction | P2 |
| No database backup strategy | Data loss risk | P2 |
| Blog post plain-text rendering | Poor content UX | P2 |
| Template IDs are `mock-...` | Confusing if user inspects | P3 |
| Admin "Your authority: Full" hardcoded | Misleading for scoped admins | P3 |
| No service worker for PWA | PWA manifest exists but no offline support | P3 |
| Recharts bundle size (~400KB) | Client JS weight | P3 |

---

## 9. SaaS MVP Readiness

| Dimension | Score | Notes |
|---|---|---|
| Core functionality | 80% | Form lifecycle works, admin works, auth works |
| Security | 20% | No rate limiting, no CSP, XSS vector, no password reset |
| Scalability | 40% | SQLite won't scale; Postgres support exists but untested |
| Monitoring | 10% | No error tracking, no logging, no uptime monitoring |
| DevOps | 30% | Vercel deploy works, no CI/CD, no backup, no staging |
| UX polish | 85% | Professional, responsive, animated |
| SEO | 75% | Good metadata, sitemap, robots — no structured data |
| Documentation | 20% | No README, no API docs, no `.env.example` |

**Overall MVP readiness: 45/100**

---

## 10. Launch Blockers (P0 — Must fix before any public deployment)

1. **Add `middleware.ts` with rate limiting** on auth routes, submissions, contact, upload. Use an in-memory store or Prisma `RateLimit` table (schema leftover exists from reverted commits).
2. **Remove SVG from upload allowlist** or serve uploaded SVGs as `Content-Disposition: attachment` (download-only, not inline rendering).
3. **Set `SESSION_SECRET` to required** — throw on startup if unset in production. Remove the fallback.
4. **Add security headers** in `next.config.ts` or middleware: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy`.
5. **Implement password reset** — email-based token flow.
6. **Add `.env.example`** listing all required env vars.
7. **Set up database backups** (pg_dump cron for Postgres, file copy for SQLite).

---

## 11. Development Roadmap

### P0 — Launch Blockers (1–2 weeks)
- Add `middleware.ts` with rate limiting (submissions: 30/min, auth: 10/min, contact: 5/min)
- Add security headers (CSP, HSTS, X-Frame-Options, etc.)
- Remove SVG from upload allowlist OR serve as attachment
- Make `SESSION_SECRET` required in production
- Implement password reset flow
- Fix completion rate bug
- Fix title/description save bug
- Add `.env.example`
- Set up database backups

### P1 — Post-Launch Essentials (2–4 weeks)
- Email verification on registration
- Email notifications for new submissions/contact messages
- Account lockout after N failed logins
- Onboarding flow for new users
- Rich text / markdown for blog posts
- Error monitoring (Sentry or similar)
- Structured data (JSON-LD) for blog posts
- Loading states on all form submissions

### P2 — Growth Features (1–2 months)
- Form analytics (views over time, conversion rate)
- Email invitations / sharing
- Form themes / customization
- Embed forms (iframe/script)
- Webhook integrations
- API keys for programmatic access
- Multi-language support
- Custom domain support

### P3 — Nice to Have
- Form templates marketplace
- Collaborative form editing
- Conditional logic (show/hide fields)
- File uploads to form submissions
- Submission notifications (Slack, Discord)
- Two-factor authentication
- Audit log
- Custom CSS for forms

---

## 12. Final Verdict

Formitect is a **well-built MVP with a polished UI and solid core functionality**. The codebase is clean, the design system is consistent, and the admin panel is genuinely useful. The developer clearly understands modern Next.js patterns.

However, **it is not safe for public deployment in its current state**. The security gaps — particularly no rate limiting, stored XSS via SVG, and the `SESSION_SECRET` fallback — are serious and would be immediately exploited. The missing password reset and email verification are also critical for any real user base.

**If the P0 items are addressed**, this becomes a viable self-hosted form builder for small teams and indie makers. The architecture supports scaling to Postgres, the permission system is well-designed, and the admin panel provides real operational value.

**Recommended next step**: Fix the 7 P0 items, then deploy to a staging environment for a security-focused QA pass before any public launch.
