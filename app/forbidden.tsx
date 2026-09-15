import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-foreground">
      <div className="card animate-fade-up flex w-full max-w-md flex-col items-center px-8 py-14 text-center sm:px-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas ring-1 ring-line">
          <ShieldX className="h-8 w-8 text-accent" />
        </span>
        <p className="mt-6 text-6xl font-black tracking-tight">403</p>
        <h1 className="mt-3 text-xl font-bold">Access forbidden</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          You&apos;re signed in, but you don&apos;t have permission to view this page. If you
          think this is a mistake, contact the administrator.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-primary flex-1">
            Go to dashboard
          </Link>
          <Link href="/" className="btn-secondary flex-1">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}