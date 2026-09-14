import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FormCraft — build beautiful forms in minutes",
    short_name: "FormCraft",
    description:
      "Create beautiful forms, share them anywhere, and collect submissions — no code needed.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d10",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}