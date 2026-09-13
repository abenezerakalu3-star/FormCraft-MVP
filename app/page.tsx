import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export default async function Home() {
  const user = await getSessionUser();
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <span className="text-xl font-bold tracking-tight">FormCraft</span>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Start for free
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-32 text-center">
        <div className="mb-6 rounded-full border bg-white px-4 py-1 text-sm font-medium text-gray-600 shadow-sm">
          No credit card required
        </div>
        <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight">
          Build beautiful forms
          <br />
          in minutes
        </h1>
        <p className="mb-10 max-w-lg text-lg text-gray-500">
          Create custom forms with a visual builder, share them via link, and collect
          submissions — all without writing any code.
        </p>
        <Link
          href="/register"
          className="rounded-xl bg-black px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-gray-800"
        >
          Create my first form &rarr;
        </Link>

        <div className="mt-24 grid w-full max-w-2xl gap-8 text-left sm:grid-cols-3">
          {[
            { title: "Drag & Drop", desc: "Add text, email, dates, dropdowns, checkboxes and more." },
            { title: "Share Instantly", desc: "Get a unique link for each form — send it or embed it." },
            { title: "View Results", desc: "All submissions are stored and viewable in a clean dashboard." },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="mb-1 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}