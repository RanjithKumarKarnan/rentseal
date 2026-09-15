import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { SITE } from "@/lib/site";
import { routes } from "@/routes";
import { renderHead, tagsForMatches } from "@/seo/meta";

/*
 * The app as Node sees it, for the build. scripts/prerender.mjs loads this
 * (after `vite build --ssr`) and writes one HTML file per page from it, along
 * with the site files and social cards below. None of it ships to the browser.
 */
export { prerenderPaths } from "@/seo/paths";
export { manifestJson, robotsTxt, sitemapXml } from "@/seo/site-files";
export { ogCards } from "@/seo/og-cards";

export type RenderResult = { redirect: string } | { html: string; head: string };

export async function render(path: string): Promise<RenderResult> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(path, SITE.url)));
  if (context instanceof Response) {
    return { redirect: context.headers.get("Location") ?? "/" };
  }

  const router = createStaticRouter(handler.dataRoutes, context);
  const html = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
  const head = renderHead(
    tagsForMatches(context.matches.map((m) => ({ handle: m.route.handle, params: m.params }))),
  );
  return { html, head };
}
