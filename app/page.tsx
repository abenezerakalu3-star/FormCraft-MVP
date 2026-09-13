import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  Database,
  LayoutGrid,
  Send,
  ShieldCheck,
  Sparkles,
  Table2,
  Zap,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";

const features = [
  {
    icon: LayoutGrid,
    title: "Visual builder",
    desc: "Add text, emails, dates, dropdowns, checkboxes and more — no code required.",
  },
  {
    icon: Send,
    title: "Share instantly",
    desc: "Every form gets a unique link. Send it via email, chat, or embed it anywhere.",
  },
  {
    icon: Table2,
    title: "Organized results",
    desc: "All responses land in a clean table. Export to CSV whenever you need it.",
  },
  {
    icon: ShieldCheck,
    title: "Smart validation",
    desc: "Required fields, email checks, and dropdown limits enforced on the server.",
  },
  {
    icon: Zap,
    title: "Fast & lightweight",
    desc: "Boots in milliseconds. No tracking, no pop-ups — just your form.",
  },
  {
    icon: Database,
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

export default async function Home() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-black text-surface dark:text-background">
              F
            </span>
            FormCraft
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
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="btn-primary">
                Go to dashboard
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
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(closest-side, rgba(99,102,241,0.35), transparent 100%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Free forever for creators
            </div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
              Build beautiful forms{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-sky-400">
                in minutes
              </span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Create custom forms with a visual builder, share a link, and collect
              submissions — without writing any code.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={user ? "/dashboard" : "/register"} className="btn-primary px-6 py-3 text-base">
                Create my first form <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how" className="btn-secondary px-6 py-3 text-base">
                See how it works
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <Zap className="h-4 w-4 text-indigo-500" /> 0 lines of code
              </span>
              <span className="h-4 w-px bg-line" />
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" /> No card required
              </span>
            </div>
          </div>

          {/* Hero mock */}
          <div className="relative animate-scale-in lg:justify-self-end">
            <div
              className="absolute -inset-6 rounded-3xl opacity-70 blur-2xl"
              style={{
                background: "radial-gradient(closest-side, rgba(79,70,229,0.16), transparent 70%)",
              }}
            />
            <div className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-7 shadow-2xl shadow-indigo-900/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Coffee className="h-5 w-5 text-indigo-500" /> Coffee Order
                  </h3>
                  <p className="mt-0.5 text-sm text-muted">
                    Help us brew the perfect cup.
                  </p>
                </div>
                <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
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
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
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
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 dark:hover:border-indigo-500/40"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Three steps to your first form</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-line bg-surface p-7">
              <span className="text-4xl font-black text-indigo-500/20">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Simple, honest pricing</h2>
            <p className="mt-3 text-muted">Start free, upgrade when you grow.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            {prices.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-8 ${
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
                  href={user ? "/dashboard" : "/register"}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                    p.highlight
                      ? "bg-indigo-500 text-white hover:bg-indigo-400"
                      : "border border-line bg-surface text-foreground hover:bg-gray-50 dark:hover:bg-gray-100/10"
                  }`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[540px] -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight">Ready to build your first form?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Join the creators collecting better data with FormCraft.
            </p>
            <Link
              href={user ? "/dashboard" : "/register"}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 active:scale-[0.98]"
            >
              {user ? "Open dashboard" : "Get started — it's free"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-xs font-black text-surface dark:text-background">
              F
            </span>
            FormCraft
          </div>
          <p className="text-xs text-muted">© {new Date().getFullYear()} FormCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}