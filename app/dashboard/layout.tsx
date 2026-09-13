import Link from "next/link";
import { requireUser } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            FormCraft
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/forms/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              New form
            </Link>
            <span className="text-sm text-gray-500">{user.name || user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}