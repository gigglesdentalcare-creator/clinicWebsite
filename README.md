# Giggles Dental Care — Website

Website for **Giggles Dental Care**, a family dental clinic in Sri Ram Nagar, Kondapur, Hyderabad, treating both children and adults. Modern, mobile-first and built to be edited by clinic staff through a CMS.

> **Status:** Phase 1 (foundation) done; Phase 2 (CMS) in progress — Sanity schemas, embedded Studio at `/studio`, GROQ queries, revalidation webhook and draft preview are in place. Treatment pages and the booking form are next (see [Roadmap](#roadmap)).

## Technologies used

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) + React + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with design tokens in `app/globals.css` |
| Fonts | `next/font` — Fraunces (headings) and DM Sans (body) |
| Icons | [lucide-react](https://lucide.dev) |
| Animation | [Motion](https://motion.dev) for scroll reveals (`components/motion/`); CSS keyframes for the above-the-fold entrance; all respect *reduce motion* |
| CMS | [Sanity](https://www.sanity.io) via `next-sanity` — Studio embedded at `/studio`, GROQ queries, TypeGen types, draft preview |
| Analytics | [Vercel Web Analytics](https://vercel.com/docs/analytics) — visitor traffic to the public site (not `/studio`); see [Analytics](#analytics) |
| Linting | ESLint (`eslint-config-next`) |
| Hosting | [Vercel](https://vercel.com) |

**Planned** (see the technical plan): Zod + Resend + Cloudflare Turnstile for the enquiry form.

## Run locally

Two ways to run the site. Both need `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` (the site won't start without it) and one Sanity CORS entry for the exact URL you browse from. Use whichever setup you work in.

### Option A — On your own computer (localhost)

**Prerequisites:** Node.js 20.9+ (Node 24 is used in development), npm and Git.

1. **Clone and install**
   ```bash
   git clone https://github.com/gigglesdentalcare-creator/clinicWebsite.git
   cd clinicWebsite
   npm install
   ```
2. **Create `.env.local`** and set `NEXT_PUBLIC_SANITY_PROJECT_ID` to your project ID from <https://www.sanity.io/manage>:
   ```bash
   cp .env.example .env.local
   ```
3. **Allow the URL in Sanity** — Manage → your project → **API → CORS origins** → add `http://localhost:3000` and tick *Allow credentials*.
4. **Start the dev server**
   ```bash
   npm run dev
   ```
5. **Open**
   - Website: <http://localhost:3000> (hot-reloads as you edit files)
   - CMS Studio: <http://localhost:3000/studio> (log in with your Sanity account)

If port 3000 is busy, `next dev` names the process using it; or run `npm run dev -- -p 3001` and add `http://localhost:3001` to the CORS origins instead.

### Option B — In GitHub Codespaces

Nothing to install: Node and npm are already available in the Codespace.

1. **Open a Codespace** — on the repo page choose **Code → Codespaces → Create codespace on main** (or reopen an existing one).
2. **Install dependencies** in the Codespace terminal
   ```bash
   npm install
   ```
3. **Create `.env.local`** and set `NEXT_PUBLIC_SANITY_PROJECT_ID` (this file is git-ignored, so a new Codespace needs it created again):
   ```bash
   cp .env.example .env.local
   ```
4. **Find your Codespace URL** — the site is served on a forwarded address, not `localhost`. Print it with:
   ```bash
   echo "https://$CODESPACE_NAME-3000.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN"
   ```
   It looks like `https://<codespace-name>-3000.app.github.dev` (also shown in the **Ports** tab).
5. **Allow that exact URL in Sanity** — Manage → your project → **API → CORS origins** → add the URL from step 4 and tick *Allow credentials*. Don't use a wildcard such as `https://*.app.github.dev` — it would let other people's Codespaces make credentialed requests to your project.
6. **Start the dev server**
   ```bash
   npm run dev
   ```
7. **Open** the URL from step 4 (or click **Open in Browser** on the port-3000 notification):
   - Website: `https://<codespace-name>-3000.app.github.dev`
   - CMS Studio: `https://<codespace-name>-3000.app.github.dev/studio`

Notes for Codespaces:
- [next.config.ts](next.config.ts) already lets the Next.js dev server accept your Codespace hostname, so hot reload works.
- Port 3000 is **private** by default: only you, signed in to GitHub, can open the URL. Keep it that way while the site has no real content.
- The URL stays the same while you reuse the same Codespace, but a **new** Codespace gets a new URL — add it to the CORS origins too, and remove old ones you no longer use.

### Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build locally (run `build` first) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate Next.js route types, then type-check with `tsc` |
| `npm run typegen` | Regenerate `sanity.types.ts` from the Sanity schema and GROQ queries (run after changing either) |

### Environment variables

Copy `.env.example` to `.env.local` (git-ignored, never commit it).

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | No (default `production`) | Sanity dataset name |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL for metadata; defaults to `http://localhost:3000` |
| `SANITY_API_READ_TOKEN` | For draft preview | Sanity token with **Viewer** role; server-only |
| `SANITY_REVALIDATE_SECRET` | For production | Shared secret that signs the Sanity webhook (any long random string; use a different one per environment) |

## CMS (Sanity) setup

1. **Allow the site in Sanity** (also covered in the run steps above) — at <https://www.sanity.io/manage> → your project → **API → CORS origins**, add the exact URL you open the site from (tick *Allow credentials*): `http://localhost:3000` locally, or your Codespaces URL such as `https://<codespace-name>-3000.app.github.dev`. Add your Vercel and production domains the same way later. Don't use a wildcard like `https://*.app.github.dev` — that would let other people's Codespaces make credentialed requests to your project.
2. **Log in to the Studio** at `/studio` and fill in **Clinic details & settings** — the phone/WhatsApp numbers there replace the placeholders in [lib/site.ts](lib/site.ts) across the site.
   - **Add recommended products** under **Recommended product** — name, image, description and a link to where it's sold; they appear on `/recommendations`, ordered by the `order` field. The page's own title/intro is under **Recommendations page**.
   - **Add the team** under **Doctor** — name, photo and bio show on `/team`; qualifications, specialisation and registration number show too, if filled in.
   - **Add social links** under **Clinic details & settings → Social & reviews** — Instagram and Facebook links show on `/contact` with icons; LinkedIn/X/YouTube show too, with a plain icon since brand icons for those aren't available (see [Known issues](#known-issues)).
3. **Draft preview (optional)** — create an API token with the *Viewer* role (Manage → API → Tokens) and set it as `SANITY_API_READ_TOKEN`. Then use the **Presentation** tool in the Studio to preview unpublished changes.
4. **Live updates in production** — in Manage → API → Webhooks, create a webhook to `https://<your-domain>/api/revalidate` for create/update/delete, projection `{_type}`, with a secret that matches `SANITY_REVALIDATE_SECRET`. Published edits then appear on the next page visit.

### How published changes reach the site

Content fetched from Sanity is cached so the site stays fast, and refreshed when something tells the site it changed — or, at the latest, about a minute later:

| Where | What refreshes it |
|---|---|
| **Development** (localhost / Codespaces) | `<SanityLive />` — with the site open in a browser tab, published changes refresh automatically within seconds. |
| **Draft preview** (Presentation tool) | `<SanityLive />` plus draft mode, so unpublished edits show too. |
| **Production** (Vercel) | The webhook above refreshes content immediately. As a safety net, every content page also re-fetches on its own at most every 60 seconds (`sanity/lib/fetch.ts`), so a missed or unconfigured webhook delays changes by about a minute instead of leaving them stale until the next deploy. |

If a published change doesn't show up in development, keep the site open in a tab and publish again (the live connection only sees changes made while it is connected). The webhook route can also be exercised directly: a request without a valid `sanity-webhook-signature` gets `401`, and a correctly signed one returns `200 {"revalidated":"sanity:<type>"}`. A Codespaces port is private by default, so Sanity can't call the webhook there — that's expected; use production or a public tunnel for it.

### Known issues

- **Console warning in the Studio: "React does not recognize the `flexGrow` prop on a DOM element" (at `aside`).** Comes from Sanity's own document-inspector panel (`sanity` 6.15.0) passing a styled-component prop through to the DOM; it is not from this project's code. React only shows it in development, and the Studio keeps working. It should disappear when Sanity ships a fix — re-check after upgrading `sanity` and `next-sanity`.
- **No Instagram/Facebook icons from lucide-react.** The installed version (1.47.0) dropped brand/trademarked icons. [components/icons/SocialIcons.tsx](components/icons/SocialIcons.tsx) has small hand-drawn stand-ins for those two; LinkedIn/X/YouTube (also offered in Studio) fall back to a plain link icon, with the platform name shown as text alongside it either way.

## Project structure

```
app/(site)/                  Public website routes + layout (header, footer, mobile CTA bar)
app/(site)/recommendations/  /recommendations — CMS-driven, a template for Phase 3's other pages
app/(site)/team/             /team — doctor profiles (name, photo, bio) from Sanity, as alternating photo/text rows
app/(site)/contact/          /contact — address, phone, WhatsApp, email, social links from Sanity
app/studio/                  Embedded Sanity Studio at /studio
app/robots.ts, app/sitemap.ts  robots.txt / sitemap.xml
app/api/revalidate/          Sanity webhook → cache revalidation
app/api/draft-mode/          Enable/disable draft preview
components/layout/           Header, Footer, MobileCtaBar
components/motion/           MotionProvider + Reveal / RevealGroup / RevealItem (scroll animations)
components/sections/         Home page sections
components/recommendations/  ProductRow (used by /recommendations)
components/team/             DoctorRow (used by /team)
components/ui/               ReadMore (clamps long text, shows a toggle only when needed)
components/icons/            Hand-drawn Instagram/Facebook icons — see "Known issues"
components/seo/              LocalBusinessJsonLd (structured data)
lib/site.ts                  Fallback clinic details + nav links
lib/site-info.ts             Clinic details from the CMS (incl. address, email, hours, social links), falling back to lib/site.ts
sanity/schemaTypes/          Content models (treatments, doctors, testimonials, gallery, FAQs, blog, pages, recommended products…)
sanity/lib/                  Sanity client, live fetch helper, GROQ queries, image URLs, cache tags
sanity.config.ts             Studio configuration
sanity.types.ts              Generated types (do not edit by hand)
public/                      Static assets
```

Until the clinic fills in **Clinic details & settings** in the Studio, the site shows **placeholder** phone/WhatsApp numbers from [lib/site.ts](lib/site.ts) — replace them before going live.

## Deploy to Vercel

1. Push the repo to GitHub and import it at <https://vercel.com/new> (framework preset: Next.js, no config needed).
2. Add the environment variables from `.env.example` under **Project → Settings → Environment Variables**.
3. Every push to `main` deploys to production; every pull request gets its own preview URL.
4. Add the custom domain under **Project → Settings → Domains**.

## Analytics

Page-view traffic is tracked with [Vercel Web Analytics](https://vercel.com/docs/analytics) (the `<Analytics />` component in [app/(site)/layout.tsx](<app/(site)/layout.tsx>)). It only tracks the public site — not `/studio`, so clinic staff logging in to the CMS don't skew the numbers.

1. In the Vercel dashboard, open the project → **Analytics** tab → **Enable**. Nothing else to configure; the component is already in the code.
2. Data only appears for **deployed** traffic (production and preview URLs) — it does **not** track `npm run dev` on localhost or in Codespaces, so you won't see anything while developing locally.
3. Once enabled and deployed, the **Analytics** tab shows visitors, page views, top pages, referrers (where traffic came from — Google, direct, social, etc.), and devices, usually within a few minutes of the first real visit.
4. The free (Hobby) plan keeps 30 days of data; Pro extends that. No cookies or personal data are collected, so no cookie-consent banner is needed for this alone.

For deeper detail (which treatments people view, whether they use Call vs. WhatsApp vs. the booking form, session recordings), a **Google Analytics 4** property or a privacy-focused tool like Plausible/Fathom can be added later — ask if you want one wired in.

## Roadmap

1. **Foundation** — scaffold, design tokens, layout shell *(done)*
2. **CMS** — Sanity schemas, embedded Studio, revalidation webhook, draft preview *(in progress — seed content still to do)*
3. **Pages** — Home sections, Treatments (Kids / Adults filter), Kids Dentistry, Team, Gallery, Contact, Recommendations *(Team, Contact and Recommendations done — see [CMS setup](#cms-sanity-setup) to add doctors/products/social links)*
4. **Conversion** — `/book` enquiry form (email + spam protection), WhatsApp/call CTAs, analytics
5. **SEO & QA** — structured data (`Dentist` JSON-LD), sitemap, OG images, Lighthouse/accessibility pass
6. **Launch** — custom domain, Google Business Profile, staff handover guide
