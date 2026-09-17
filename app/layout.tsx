import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import MotionProvider from "@/components/motion/motion-provider";
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
    default: "Formitect — build beautiful forms in minutes",
    template: "%s — Formitect",
  },
  description:
    "Create beautiful forms, share them anywhere, and collect submissions — no code needed. Free forever.",
  keywords: [
    "form builder",
    "create forms online",
    "free form maker",
    "collect responses",
    "survey builder",
    "Formitect",
  ],
  authors: [{ name: "Formitect" }],
  creator: "Formitect",
  applicationName: "Formitect",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Formitect",
    title: "Formitect — build beautiful forms in minutes",
    description:
      "Create beautiful forms, share them anywhere, and collect submissions — no code needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formitect — build beautiful forms in minutes",
    description:
      "Create beautiful forms, share them anywhere, and collect submissions — no code needed.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "productivity",
  other: {
    "google-site-verification": "AZW5IzuCr83Xed0Z8JhuVXb30Q470Cve3Y3T8RV75js",
  },
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
        <MotionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}