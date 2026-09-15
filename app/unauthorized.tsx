import Link from "next/link";
import { Lock } from "lucide-react";

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-foreground">
      <div className="card animate-fade-up flex w-full max-w-md flex-col items-center px-8 py-14 text-center sm:px-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas ring-1 ring-line">
          <Lock className="h-8 w-8 text-accent" />
        </span>
        <p className="mt-6 text-6xl font-black tracking-tight">401</p>
        <h1 className="mt-3 text-xl font-bold">Sign in required</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          You need to sign in to access this page. Please log in to continue.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary flex-1">
            Sign in
          </Link>
          <Link href="/register" className="btn-secondary flex-1">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}