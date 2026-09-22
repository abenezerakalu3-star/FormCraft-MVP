import { getAppUrl } from "@/lib/url";
import type { MetadataRoute } from "next";

const APP_URL = getAppUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api/", "/form/"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}