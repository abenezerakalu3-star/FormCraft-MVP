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
  Rocket,
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
import LogoMark from "@/components/logo-mark";
import FadeIn from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import StatCount from "@/components/motion/stat-count";
import Magnetic from "@/components/motion/magnetic";
import TiltCard from "@/components/motion/tilt-card";
import { ParallaxLayer, PointerParallax } from "@/components/motion/pointer-parallax";
import SiteFooter from "@/components/site-footer";
import MobileMenu from "@/components/mobile-menu";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const desc = `${settings.tagline} Free forever.`;
  return {
    title: `${settings.siteName} — ${settings.tagline}`,
    description: desc,
    alternates: { canonical: "/" },
    openGraph: {
      title: `${settings.siteName} — ${settings.tagline}`,
      description: desc,
      type: "website",
      siteName: settings.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.siteName} — ${settings.tagline}`,
      description: desc,
    },
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

const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/formcraft-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-formitect";
const PRODUCT_HUNT_BADGE =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1251167&theme=light&t=1789517075563";

const productHuntFlow = [
  { icon: ClipboardList, label: "Create" },
  { icon: Send, label: "Share" },
  { icon: Inbox, label: "Collect" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: settings.siteName,
            description: settings.tagline,
            url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          }),
        }}
      />
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
            <LogoMark />
            {settings.siteName}
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <a href="#features" className="nav-link transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how" className="nav-link transition-colors hover:text-foreground">
              How it works
            </a>
            <Link href="/blog" className="nav-link transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link href="/pricing" className="nav-link transition-colors hover:text-foreground">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link href={homeHref} className="hidden btn-primary sm:inline-flex">
                {user?.role === "admin" ? "Go to admin" : "Go to dashboard"}
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden text-sm font-medium text-muted hover:text-foreground sm:inline-flex">
                  Log in
                </Link>
                <Link href="/register" className="hidden btn-primary sm:inline-flex">
                  Start free
                </Link>
              </>
            )}
            <MobileMenu
              items={[
                { href: "#features", label: "Features" },
                { href: "#how", label: "How it works" },
                { href: "/blog", label: "Blog" },
                { href: "/pricing", label: "Pricing" },
                ...(user
                  ? [{ href: homeHref, label: user.role === "admin" ? "Go to admin" : "Go to dashboard" }]
                  : [
                      { href: "/login", label: "Log in" },
                      { href: "/register", label: "Start free" },
                    ]),
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <ParallaxLayer depth={-12} className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2">
          <div
            className="h-[560px] w-[900px] rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(99,102,241,0.30), transparent 100%)" }}
          />
        </ParallaxLayer>
        <ParallaxLayer depth={-10} className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full opacity-40 blur-3xl dark:hidden">
          <div
            className="h-full w-full rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(14,165,233,0.22), transparent 100%)" }}
          />
        </ParallaxLayer>

        <PointerParallax className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-28 pt-20 lg:grid-cols-2">
          <div>
            <FadeIn>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                Free forever for creators
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.04]">
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
                <Magnetic>
                  <Link href={homeHref} className="btn-primary px-6 py-3 text-base">
                    {settings.heroCta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a href="#how" className="btn-secondary px-6 py-3 text-base">
                    See how it works
                  </a>
                </Magnetic>
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
            <TiltCard intensity={10} spotlight="rgba(79,70,229,0.10)" className="w-full max-w-md">
            <div className="relative rounded-3xl border border-line bg-surface p-7 shadow-2xl shadow-indigo-900/10">
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

                {/* Floating notes */}
                <div className="absolute -left-12 top-16 hidden sm:block">
                  <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-xl shadow-indigo-900/10">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold">Response received</p>
                      <p className="text-[10px] text-muted">Auto-saved securely</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-5 bottom-20 hidden sm:block">
                  <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-xl shadow-indigo-900/10">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[11px] font-semibold">Instant results</p>
                  </div>
                </div>
              </div>
            </div>
            </TiltCard>
          </FadeIn>
        </PointerParallax>

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
                  <TiltCard className="h-full rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 dark:hover:border-indigo-500/40">
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors ${f.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-base font-semibold">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                  </TiltCard>
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
              <TiltCard className="h-full rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                {i < 2 && (
                  <span className="absolute -right-3.5 top-1/2 hidden h-px w-7 bg-indigo-300 dark:bg-indigo-500/50 md:block" />
                )}
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Product Hunt launch spotlight */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 shadow-sm sm:px-12 lg:px-16">
            <div
              className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(99,102,241,0.14), transparent 100%)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full opacity-50 blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(249,115,22,0.08), transparent 100%)" }}
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-muted">
                  <Rocket className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                  We&apos;re on Product Hunt
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {settings.siteName} is now on Product Hunt.
                </h2>
                <p className="mt-3 max-w-md text-muted">
                  We just launched on Product Hunt! Discover what we&apos;re building, show your support
                  with an upvote, and help share {settings.siteName} with people who love good forms.
                </p>
                <Magnetic>
                  <a
                    href={PRODUCT_HUNT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-8 px-6 py-3 text-base"
                  >
                    View on Product Hunt <ArrowRight className="h-4 w-4" />
                  </a>
                </Magnetic>

                <Stagger className="mt-9 flex flex-wrap items-center gap-y-3">
                  {productHuntFlow.map((s, i) => (
                    <div key={s.label} className="flex items-center">
                      <StaggerItem>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-semibold text-foreground">
                          <s.icon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                          {s.label}
                        </span>
                      </StaggerItem>
                      {i < productHuntFlow.length - 1 && (
                        <ArrowRight className="mx-3 h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                  ))}
                </Stagger>
              </div>

              <div className="flex justify-center lg:justify-end">
                <a
                  href={PRODUCT_HUNT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex rounded-2xl border border-line bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/5"
                  aria-label={`${settings.siteName} on Product Hunt`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Formitect - Create. Share. Collect. | Product Hunt"
                    width={250}
                    height={54}
                    src={PRODUCT_HUNT_BADGE}
                    className="h-auto w-[250px] max-w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
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
              <Magnetic>
              <Link
                href={homeHref}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 active:scale-[0.98]"
              >
                {user ? "Open dashboard" : "Get started — it's free"} <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
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