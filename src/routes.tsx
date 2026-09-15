import type { ComponentType } from "react";
import { redirect, type RouteObject } from "react-router";
import { BuilderLayout } from "@/layouts/builder-layout";
import { RootLayout } from "@/layouts/root-layout";
import { SiteLayout } from "@/layouts/site-layout";
import NotFound from "@/pages/not-found";
import type { RouteHead } from "@/seo/meta";
import { OG_RENTAL, OG_STAMP, ogRentalDistrict, ogService, ogStampDistrict } from "@/seo/og";

interface PageModule {
  default: ComponentType;
  meta?: RouteHead["meta"];
}

/**
 * A page's code, fetched the first time someone opens it, together with what it
 * puts in <head>. Pages share the site-wide social card unless given their own.
 */
function page(load: () => Promise<PageModule>, og?: RouteHead["og"]) {
  return async () => {
    const mod = await load();
    const handle: RouteHead = { meta: mod.meta, og };
    return { Component: mod.default, handle };
  };
}

export const routes: RouteObject[] = [
  {
    Component: RootLayout,
    children: [
      {
        // The marketing pages: header, footer and the mobile call bar.
        Component: SiteLayout,
        children: [
          { index: true, lazy: page(() => import("@/pages/home")) },
          { path: "about", lazy: page(() => import("@/pages/about")) },
          { path: "certificates", lazy: page(() => import("@/pages/certificates")) },
          { path: "contact", lazy: page(() => import("@/pages/contact")) },
          { path: "faq", lazy: page(() => import("@/pages/faq")) },
          { path: "how-it-works", lazy: page(() => import("@/pages/how-it-works")) },
          { path: "legal/privacy", lazy: page(() => import("@/pages/legal-privacy")) },
          { path: "legal/refund", lazy: page(() => import("@/pages/legal-refund")) },
          { path: "legal/terms", lazy: page(() => import("@/pages/legal-terms")) },
          { path: "pricing", lazy: page(() => import("@/pages/pricing")) },
          {
            path: "rental-agreement",
            lazy: page(() => import("@/pages/rental-agreement"), OG_RENTAL),
          },
          {
            path: "rental-agreement/:district",
            lazy: page(
              () => import("@/pages/rental-agreement-district"),
              (params) => ogRentalDistrict(params.district ?? ""),
            ),
          },
          { path: "search", lazy: page(() => import("@/pages/search")) },
          {
            path: "services/:slug",
            lazy: page(
              () => import("@/pages/service"),
              (params) => ogService(params.slug ?? ""),
            ),
          },
          { path: "sitemap", lazy: page(() => import("@/pages/sitemap")) },
          { path: "stamp-paper", lazy: page(() => import("@/pages/stamp-paper"), OG_STAMP) },
          {
            path: "stamp-paper/:district",
            lazy: page(
              () => import("@/pages/stamp-paper-district"),
              (params) => ogStampDistrict(params.district ?? ""),
            ),
          },
          { path: "templates", lazy: page(() => import("@/pages/templates")) },
        ],
      },
      {
        // The drafter: no site header or footer, and screenshots guarded.
        Component: BuilderLayout,
        children: [
          /**
           * The catalogue lives at /templates.
           *
           * This route rendered a second grid of the same sixty-two documents,
           * with the same cards and the same links, one URL away from the one
           * the header points at. Two identical lists is a choice the reader
           * has to make twice and a page of duplicate content for a crawler to
           * reconcile, so there is one list now and this redirects to it. Every
           * /create/<document> route is untouched: those are the drafter
           * itself, which is what the cards link to.
           */
          { path: "create", loader: () => redirect("/templates") },
          { path: "create/:type", lazy: page(() => import("@/pages/create")) },
        ],
      },
      { path: "success", lazy: page(() => import("@/pages/success")) },
      { path: "*", Component: NotFound, handle: { notFound: true } satisfies RouteHead },
    ],
  },
];
