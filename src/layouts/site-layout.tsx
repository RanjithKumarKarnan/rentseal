import { Outlet } from "react-router";
import { Footer } from "@/components/site/footer";
import { HashScroll } from "@/components/site/hash-scroll";
import { Header } from "@/components/site/header";
import { MobileCta } from "@/components/site/mobile-cta";
import { ScreenshotGuard } from "@/components/site/screenshot-guard";

export function SiteLayout() {
  return (
    <>
      <HashScroll />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileCta />
      {/*
        Marketing routes only. The builder is deliberately left out — the
        agreement there is the customer's own document and they are meant to be
        able to print and keep it.
      */}
      <ScreenshotGuard />
    </>
  );
}
