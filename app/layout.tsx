import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import BuyMeCoffeeWidget from "@/components/buy-me-coffee-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "FormCraft — build beautiful forms in minutes",
    template: "%s — FormCraft",
  },
  description:
    "Create beautiful forms, share them anywhere, and collect submissions — no code needed. Free forever.",
  keywords: [
    "form builder",
    "create forms online",
    "free form maker",
    "collect responses",
    "survey builder",
    "FormCraft",
  ],
  authors: [{ name: "FormCraft" }],
  creator: "FormCraft",
  applicationName: "FormCraft",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FormCraft",
    title: "FormCraft — build beautiful forms in minutes",
    description:
      "Create beautiful forms, share them anywhere, and collect submissions — no code needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FormCraft — build beautiful forms in minutes",
    description:
      "Create beautiful forms, share them anywhere, and collect submissions — no code needed.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <BuyMeCoffeeWidget />
      </body>
    </html>
  );
}