# Giggles Dental Care — Website

Website for **Giggles Dental Care**, a family dental clinic in Sri Ram Nagar, Kondapur, Hyderabad, treating both children and adults. Modern, mobile-first and built to be edited by clinic staff through a CMS.

> **Status:** Phase 1 (foundation) — layout, design tokens, header/footer, sticky mobile call/WhatsApp/book bar and a placeholder home page. CMS, treatment pages and the booking form are next (see [Roadmap](#roadmap)).

## Technologies used

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) + React + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with design tokens in `app/globals.css` |
| Fonts | `next/font` — Fraunces (headings) and DM Sans (body) |
| Icons | [lucide-react](https://lucide.dev) |
| Linting | ESLint (`eslint-config-next`) |
| Hosting | [Vercel](https://vercel.com) |

**Planned** (see the technical plan): Sanity CMS (`next-sanity`, embedded Studio at `/studio`), Motion for subtle animations, Zod + Resend + Cloudflare Turnstile for the enquiry form, Vercel Analytics.

## Run locally

**Prerequisites:** Node.js 20.9+ (Node 24 is used in development) and npm.

```bash
# 1. Clone the repository
git clone <repo-url>
cd clinicWebsite

# 2. Install dependencies
npm install

# 3. (Optional) create a local env file
cp .env.example .env.local   # then edit values — none are required yet

# 4. Start the dev server
npm run dev
```

Open <http://localhost:3000>. The page hot-reloads as you edit files.

### Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build locally (run `build` first) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate Next.js route types, then type-check with `tsc` |

### Environment variables

Copy `.env.example` to `.env.local` (git-ignored). Only `NEXT_PUBLIC_SITE_URL` exists today; the CMS and email variables listed in the file are added in later phases.

## Project structure

```
app/                     Routes, root layout, global styles
components/layout/       Header, Footer, MobileCtaBar
lib/site.ts              Clinic details + nav links (moves into the CMS in Phase 2)
public/                  Static assets
```

Clinic phone/WhatsApp numbers in [lib/site.ts](lib/site.ts) are **placeholders** — replace them before going live.

## Deploy to Vercel

1. Push the repo to GitHub and import it at <https://vercel.com/new> (framework preset: Next.js, no config needed).
2. Add the environment variables from `.env.example` under **Project → Settings → Environment Variables**.
3. Every push to `main` deploys to production; every pull request gets its own preview URL.
4. Add the custom domain under **Project → Settings → Domains**.

## Roadmap

1. **Foundation** — scaffold, design tokens, layout shell *(done)*
2. **CMS** — Sanity schemas, embedded Studio, revalidation webhook, draft preview
3. **Pages** — Home sections, Treatments (Kids / Adults filter), Kids Dentistry, Team, Gallery, Contact
4. **Conversion** — `/book` enquiry form (email + spam protection), WhatsApp/call CTAs, analytics
5. **SEO & QA** — structured data (`Dentist` JSON-LD), sitemap, OG images, Lighthouse/accessibility pass
6. **Launch** — custom domain, Google Business Profile, staff handover guide
