import Link from "next/link";
import LogoMark from "@/components/logo-mark";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-foreground p-10 text-white lg:flex dark:bg-surface">
        <div
          className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #6366f1, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #0ea5e9, transparent 70%)" }}
        />
        <Link href="/" className="relative flex items-center gap-2 text-xl font-bold">
          <LogoMark />
          Formitect
        </Link>

        <div className="relative">
          <blockquote className="max-w-sm text-2xl font-semibold leading-snug">
            &ldquo;We replaced three tools with Formitect. Our response rate went up
            3× the first week.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
              AM
            </span>
            <div>
              <p className="text-sm font-semibold">Abenezer M.</p>
              <p className="text-xs text-gray-400">Founder, a small business</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span> Fast
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span> Private
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span> Free to start
          </span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <LogoMark />
              Formitect
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 mb-7 text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}