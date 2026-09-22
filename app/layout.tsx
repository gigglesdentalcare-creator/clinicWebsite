import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import ThemeScript from "@/components/theme/ThemeScript";
import { site } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Family Dentist in Kondapur, Hyderabad`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1420" },
  ],
};

// Bare shell shared by the public site and the embedded Sanity Studio (/studio).
// The clinic header/footer live in app/(site)/layout.tsx so the Studio stays clean.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
      // ThemeScript below can add `dark` before hydration; without this, React would warn
      // about the server/client mismatch on an attribute it doesn't control.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
