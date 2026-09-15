import Link from "next/link";
import { FileQuestion } from "lucide-react";

export const metadata = {
  title: "404 — Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-foreground">
      <div className="card animate-fade-up flex w-full max-w-md flex-col items-center px-8 py-14 text-center sm:px-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas ring-1 ring-line">
          <FileQuestion className="h-8 w-8 text-accent" />
        </span>
        <p className="mt-6 text-6xl font-black tracking-tight">404</p>
        <h1 className="mt-3 text-xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the link is broken.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary flex-1">
            Back to home
          </Link>
          <Link href="/contact" className="btn-secondary flex-1">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}