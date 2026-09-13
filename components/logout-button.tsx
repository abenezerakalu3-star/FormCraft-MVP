"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}