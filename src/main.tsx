import "@fontsource-variable/inter";
// Poppins sets the headings. It has no variable cut on Google Fonts, so each
// weight is its own file and only the ones headings actually ask for are
// loaded: bold, and bold italic for the emphasised half of the hero headline.
// Every weight from 100 to 900 would be most of a megabyte for eight cuts
// nothing on the site uses.
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/700-italic.css";
import "@/styles/globals.css";

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, matchRoutes } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/routes";

async function start() {
  // A built page arrives as finished HTML, and React takes it over rather than
  // drawing it again. The code for that page has to be here before it does:
  // otherwise the first render would be an empty loading state and would not
  // match the HTML it is taking over.
  const lazy = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy) ?? [];
  await Promise.all(
    lazy.map(async (m) => {
      const load = m.route.lazy as () => Promise<Record<string, unknown>>;
      Object.assign(m.route, { ...(await load()), lazy: undefined });
    }),
  );

  const router = createBrowserRouter(routes);
  const app = (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );

  const container = document.getElementById("root")!;
  // Built pages come with their HTML already inside #root; `npm run dev` serves
  // an empty one and React draws the page from scratch.
  if (container.firstElementChild) hydrateRoot(container, app);
  else createRoot(container).render(app);
}

void start();
