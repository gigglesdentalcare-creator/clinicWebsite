import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileCtaBar from "@/components/layout/MobileCtaBar";
import MotionProvider from "@/components/motion/MotionProvider";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { getSiteInfo } from "@/lib/site-info";
import { SanityLive } from "@/sanity/lib/live";

// Browser-tab and home-screen icons come from the logo uploaded in Studio, padded to a white
// square by Sanity's image CDN (the logo is drawn for a light background, as in the header).
export async function generateMetadata(): Promise<Metadata> {
  const { logo } = await getSiteInfo();
  if (!logo) return {};
  const square = (size: number) => `${logo.url}?w=${size}&h=${size}&fit=fill&bg=ffffff&fm=png`;
  return {
    icons: {
      icon: [
        { url: square(32), sizes: "32x32", type: "image/png" },
        { url: square(192), sizes: "192x192", type: "image/png" },
      ],
      apple: { url: square(180), sizes: "180x180", type: "image/png" },
    },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [info, { isEnabled: isDraftMode }] = await Promise.all([getSiteInfo(), draftMode()]);

  return (
    <div className="flex min-h-screen flex-col max-md:pb-[4.5rem]">
      {/* Scroll-reveal content starts hidden; without JS it would stay hidden, so show it. */}
      <noscript>
        <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <LocalBusinessJsonLd info={info} />
      <Header info={info} />
      <MotionProvider>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer info={info} />
      </MotionProvider>
      <MobileCtaBar info={info} />
      {/* Live refresh: in draft mode (preview) and in development, so published edits show up
          without a webhook. Production visitors don't open a live connection — their cache is
          refreshed by the webhook in app/api/revalidate instead. */}
      {(isDraftMode || process.env.NODE_ENV === "development") && <SanityLive />}
      {isDraftMode && <VisualEditing />}
      {/* Tracks visitor page views (see vercel.com/docs/analytics). Scoped to the public site,
          not the root layout, so staff logging in to /studio don't count as site traffic. */}
      <Analytics />
    </div>
  );
}
