import Link from "next/link";
import { Palette, Settings } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import AdminSettingsForm from "@/components/admin/admin-settings-form";

export default async function AdminSettingsPage() {
  await requirePermission("settings");
  const settings = await getSiteSettings();

  return (
    <div className="animate-fade-in">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/admin" className="hover:text-foreground">Home</Link> / Settings
        </div>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Settings className="h-6 w-6 text-indigo-500" /> Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Control FormCraft website content and appearance. Changes go live immediately.
        </p>
      </div>

      <AdminSettingsForm settings={settings} />

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-sm animate-fade-up">
        <div className="flex items-center gap-2 text-base font-bold tracking-tight">
          <Palette className="h-5 w-5 text-indigo-500" /> Appearance
        </div>
        <p className="mt-1 text-sm text-muted">
          The website supports light and dark themes. Every user can toggle the theme with the
          sun/moon switch in the top bar — no setting needed here.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="chip bg-gray-100 text-muted dark:bg-gray-100/10">Light theme</span>
          <span className="chip bg-gray-100 text-muted dark:bg-gray-100/10">Dark theme</span>
          <span className="chip bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Accent: indigo</span>
        </div>
      </div>
    </div>
  );
}