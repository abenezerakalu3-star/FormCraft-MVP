import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  siteName: "Formitect",
  tagline: "Build beautiful forms, share them anywhere, and collect responses — no code needed.",
  heroTitle: "Build beautiful forms",
  heroSubtitle:
    "Create beautiful forms, share them anywhere, and watch responses roll in. No code needed.",
  heroCta: "Create my first form",
  announcement: "",
  announcementUrl: "",
  footerNote: "Made for people who love good forms.",
  contactEmail: "hello@formitect.app",
} as const;

export type SiteSettings = typeof DEFAULT_SETTINGS;
export type SettingsInput = Partial<SiteSettings>;

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.setting.findMany();
    const stored = Object.fromEntries(
      rows.filter((r) => SETTING_KEYS.includes(r.key)).map((r) => [r.key, r.value])
    );
    return { ...DEFAULT_SETTINGS, ...(stored as Partial<SiteSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}