import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Coffee,
  Database,
  Download,
  Eye,
  Inbox,
  LayoutGrid,
  Send,
  ShieldCheck,
  Sparkles,
  Table2,
  Users,
  Zap,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import ThemeToggle from "@/components/theme-toggle";
import FadeIn from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import StatCount from "@/components/motion/stat-count";
import SiteFooter from "@/components/site-footer";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings.siteName} — ${settings.tagline}`,
    description: settings.tagline,
  };
}

const features = [
  {
    icon: LayoutGrid,
    color: "text-indigo-600 bg-indigo-500/10 group-hover:bg-indigo-600 dark:text-indigo-400",
    title: "Visual builder",
    desc: "Add text, emails, dates, dropdowns, checkboxes and more — no code required.",
  },
  {
    icon: Send,
    color: "text-sky-600 bg-sky-500/10 group-hover:bg-sky-600 dark:text-sky-400",
    title: "Share instantly",
    desc: "Every form gets a unique link. Send it via email, chat, or embed it anywhere.",
  },
  {
    icon: Table2,
    color: "text-emerald-600 bg-emerald-500/10 group-hover:bg-emerald-600 dark:text-emerald-400",
    title: "Organized results",
    desc: "All responses land in a clean table. Export to CSV whenever you need it.",
  },
  {
    icon: ShieldCheck,
    color: "text-rose-600 bg-rose-500/10 group-hover:bg-rose-600 dark:text-rose-400",
    title: "Smart validation",
    desc: "Required fields, email checks, and dropdown limits enforced on the server.",
  },
  {
    icon: Zap,
    color: "text-amber-600 bg-amber-500/10 group-hover:bg-amber-600 dark:text-amber-400",
    title: "Fast & lightweight",
    desc: "Boots in milliseconds. No tracking, no pop-ups — just your form.",
  },
  {
    icon: Database,
    color: "text-violet-600 bg-violet-500/10 group-hover:bg-violet-600 dark:text-violet-400",
    title: "Your data, your rules",
    desc: "Self host with your own database. Free, open, and you keep everything.",
  },
];

const steps = [
  {
    n: "01",
    title: "Build",
    desc: "Drag fields together and customize labels, options, and required rules.",
  },
  {
    n: "02",
    title: "Publish",
    desc: "Hit publish and get a shareable link for your form.",
  },
  {
    n: "03",
    title: "Collect",
    desc: "Watch responses stream into a tidy, filterable dashboard.",
  },
];

const prices = [
  {
    name: "Starter",
    monthly: "$0",
    tagline: "For trying it out and small projects",
    features: ["Unlimited forms", "1,000 responses / month", "All 8 field types", "CSV export"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: "$12",
    tagline: "For creators and small teams",
    features: [
      "Everything in Starter",
      "Unlimited responses",
      "Custom subdomain",
      "Team members",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
];

const brands = [
  { name: "Nova Labs" },
  { name: "Brightpath" },
  { name: "Atlas Co." },
  { name: "Kinda Systems" },
  { name: "Helios" },
  { name: "Polarith" },
  { name: "Verve" },
  { name: "Monard" },
];

const avatarPalette = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

export default async function Home() {
  const user = await getSessionUser();
  const settings = await getSiteSettings();
  const homeHref = user?.role === "admin" ? "/admin" : "/dashboard";

  const [creators, responses, liveForms, views, heroUsers] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.submission.count(),
    prisma.form.count({ where: { published: true } }),
    prisma.formView.count(),
    prisma.user.findMany({
      where: { role: "user", name: { not: null } },
      orderBy: { createdAt: "asc" },
      take: 6,
      select: { name: true },
    }),
  ]);

  const stats: { value: number; suffix?: string; label: string; icon: typeof Users }[] = [
    { value: creators, suffix: "+", label: "Creators", icon: Users },
    { value: responses, suffix: "+", label: "Responses collected", icon: Inbox },
    { value: liveForms, label: "Live forms", icon: ClipboardList },
    { value: views, suffix: "+", label: "Form views", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      {/* Announcement bar */}
      {settings.announcement ? (
        <div className="bg-foreground px-6 py-2.5 text-center text-sm font-semibold text-surface dark:bg-surface dark:text-foreground">
          {settings.announcement}
        </div>
      ) : null}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-black text-surface dark:text-background">
              F
            </span>
            {settings.siteName}
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-muted sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link href={homeHref} className="btn-primary">
                {user?.role === "admin" ? "Go to admin" : "Go to dashboard"}
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary">
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(99,102,241,0.30), transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full opacity-40 blur-3xl dark:hidden"
          style={{ background: "radial-gradient(closest-side, rgba(14,165,233,0.22), transparent 100%)" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-28 pt-20 lg:grid-cols-2">
          <div>
            <FadeIn>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                Free forever for creators
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="text-5xl font-bold leading-[1.04] tracking-tight">
                {settings.heroTitle}{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-sky-400">
                  in minutes
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{settings.heroSubtitle}</p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={homeHref} className="btn-primary px-6 py-3 text-base">
                  {settings.heroCta} <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how" className="btn-secondary px-6 py-3 text-base">
                  See how it works
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.34}>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                {heroUsers.length > 0 && (
                  <div className="flex -space-x-2.5">
                    {heroUsers.map((u, i) => (
                      <span
                        key={`${u.name}-${i}`}
                        title={u.name || undefined}
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${avatarPalette[i % avatarPalette.length]} text-[10px] font-bold text-white ring-2 ring-surface`}
                      >
                        {(u.name || "").slice(0, 1).toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    {creators.toLocaleString()} creator{creators === 1 ? "" : "s"}
                  </span>{" "}
                  building forms on {settings.siteName}.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Hero mock */}
          <FadeIn delay={0.2} y={32} className="relative lg:justify-self-end">
            <div
              className="absolute -inset-8 rounded-3xl opacity-70 blur-2xl"
              style={{ background: "radial-gradient(closest-side, rgba(79,70,229,0.16), transparent 70%)" }}
            />
            <div className="animate-float relative w-full max-w-md rounded-3xl border border-line bg-surface p-7 shadow-2xl shadow-indigo-900/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Coffee className="h-4.5 w-4.5" />
                    </span>
                    Coffee Order
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">Help us brew the perfect cup.</p>
                </div>
                <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> Live
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Your name", ph: "Ada Lovelace", type: "text", required: true },
                  { label: "Email", ph: "ada@example.com", type: "email", required: true },
                  { label: "Preferred roast", ph: "", type: "select", options: ["Light", "Medium", "Dark"], required: false },
                  { label: "Extras", ph: "", type: "radio", options: ["Oat milk", "Extra shot", "Caramel"], required: false },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="mb-1.5 block text-sm font-medium">
                      {f.label}
                      {f.required && <span className="text-red-500"> *</span>}
                    </label>
                    {f.type === "select" ? (
                      <div className="flex h-9 items-center justify-between rounded-lg border border-line bg-canvas px-3 text-sm text-muted">
                        {f.options?.[0]} <span className="text-gray-400">▾</span>
                      </div>
                    ) : f.type === "radio" ? (
                      <div className="flex flex-wrap gap-4 text-sm text-muted">
                        {f.options?.map((o) => (
                          <span key={o} className="inline-flex items-center gap-1.5">
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
                            {o}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-9 items-center rounded-lg border border-line bg-canvas px-3 text-sm text-gray-400">
                        {f.ph}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-surface dark:text-background">
                  Submit <Send className="h-4 w-4" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll cue */}
        <div className="relative flex justify-center pb-8">
          <a href="#trust" aria-label="Scroll to see more" className="flex flex-col items-center gap-1 text-muted transition-colors hover:text-foreground">
            <span className="text-[10px] font-semibold uppercase tracking-widest">Explore</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Trusted by marquee */}
      <section id="trust" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <FadeIn>
            <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-muted">
              Powering forms for modern teams
            </p>
          </FadeIn>
          <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
            <div className="animate-marquee flex w-max items-center gap-14">
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  aria-hidden={dup === 1}
                  className="flex shrink-0 items-center gap-14"
                >
                  {brands.map((b) => (
                    <span
                      key={`${dup}-${b.name}`}
                      className="flex items-center gap-2.5 whitespace-nowrap text-lg font-bold text-gray-300 dark:text-gray-600"
                    >
                      <Zap className="h-4 w-4" />
                      {b.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <FadeIn>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface px-6 py-8 text-center">
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="text-3xl font-bold tracking-tight">
                  <StatCount to={s.value} suffix={s.suffix ?? ""} />
                </p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Features
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Everything you need to collect great data
              </h2>
              <p className="mt-3 text-muted">
                Powerful enough for serious projects, simple enough for anyone to use.
              </p>
            </div>
          </FadeIn>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <div className="group h-full rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 dark:hover:border-indigo-500/40">
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors ${f.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-base font-semibold">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn>
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Three steps to your first form</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              From blank page to live form in under a minute.
            </p>
          </div>
        </FadeIn>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem key={s.n} className={i < 2 ? "md:relative" : ""}>
              <div className="group relative h-full rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                {i < 2 && (
                  <span className="absolute -right-3.5 top-1/2 hidden h-px w-7 bg-indigo-300 dark:bg-indigo-500/50 md:block" />
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Pricing
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Simple, honest pricing</h2>
              <p className="mt-3 text-muted">Start free, upgrade when you grow.</p>
            </div>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            {prices.map((p, idx) => (
              <FadeIn key={p.name} delay={idx * 0.12}>
                <div
                  className={`h-full rounded-2xl border p-8 ${
                    p.highlight
                      ? "border-indigo-600 bg-foreground text-white shadow-2xl shadow-indigo-900/20 dark:bg-surface dark:text-foreground dark:border-indigo-500"
                      : "border-line bg-canvas"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold">{p.name}</h3>
                    <p className={`text-3xl font-bold ${p.highlight ? "dark:text-foreground" : ""}`}>
                      {p.monthly}
                      <span className={`text-sm font-medium ${p.highlight ? "text-gray-400 dark:text-muted" : "text-muted"}`}>
                        /mo
                      </span>
                    </p>
                  </div>
                  <p className={`mt-1 text-sm ${p.highlight ? "text-gray-400 dark:text-muted" : "text-muted"}`}>
                    {p.tagline}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                            p.highlight ? "bg-indigo-500" : "bg-emerald-500"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        <span className={p.highlight ? "text-gray-200 dark:text-muted" : "text-foreground"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={homeHref}
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                      p.highlight
                        ? "bg-indigo-500 text-white hover:bg-indigo-400"
                        : "border border-line bg-surface text-foreground hover:bg-gray-50 dark:hover:bg-gray-100/10"
                    }`}
                  >
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 text-center text-white">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[540px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Free to start
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Ready to build your first form?</h2>
              <p className="mx-auto mt-3 max-w-md text-indigo-100/90">
                Join the creators collecting better data with {settings.siteName}.
              </p>
              <Link
                href={homeHref}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 active:scale-[0.98]"
              >
                {user ? "Open dashboard" : "Get started — it's free"} <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-indigo-100/80">
                <Download className="h-3.5 w-3.5" /> Export your first CSV in under a minute
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <SiteFooter settings={settings} />
    </div>
  );
}