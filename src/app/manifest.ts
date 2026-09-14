import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Web app manifest.
 *
 * Next serves this at /manifest.webmanifest and links it from every page. It
 * gives the site an installable name, a theme colour for the mobile browser
 * chrome, and an icon — the small signals a search engine and a phone both read
 * when they decide how a bookmarked or "add to home screen" site should look.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Stamp Paper & Rental Agreements in Tamil Nadu`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "en-IN",
    categories: ["business", "legal", "productivity"],
    icons: [
      { src: "/logo.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "256x256", type: "image/png", purpose: "maskable" },
    ],
  };
}
