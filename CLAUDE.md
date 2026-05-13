# CLAUDE.md — ThesLyseis Project Context

This file is the primary reference for any AI agent or developer working on this codebase.
Read this before touching any file.

---

## Company

**Θες Λύσεις (ThesLyseis)**
Energy consulting company — Thessaloniki, Greece.

Helps customers find better electricity, natural gas, and telecom plans.
Earns commission from providers. Customers pay nothing.

---

## Website Purpose

**Lead generation only.**

Goal: capture `name` + `phone` with minimal friction.
All UX decisions serve conversion, not information delivery.

---

## Tech Stack

| Layer       | Choice                              |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript (strict)                 |
| Styling     | Tailwind CSS — custom components only, NO UI libraries |
| Email       | Resend API                          |
| Lead store  | Google Sheets via webhook (POST)    |
| Hosting     | Vercel                              |
| Analytics   | Phase 5 (GA4 + Meta Pixel) — not yet implemented |

---

## Brand

```
Primary:    #000000  #5727A3
Secondary:  #9153F4  #D6C5F0  #9E9E96  #FFFFFF
```

Aesthetic: corporate, friendly, trust-oriented.
Apple-style spacing. No heavy animations. CSS-only transitions only.
**Never use Framer Motion.**

---

## Project Phase Status

| Phase | Description                              | Status      |
|-------|------------------------------------------|-------------|
| 1     | Foundation (Next.js, Tailwind, layout)   | ✅ Complete  |
| 2     | Homepage UI                              | ✅ Complete  |
| 3     | Conversion infrastructure (form + API)   | ✅ Complete  |
| 4A    | Attribution system (UTM + cookies)       | 🔄 In progress |
| 4B    | Conversion UI (Sticky CTA, Viber)        | ⏳ Next      |
| 5     | GA4 + Meta Pixel + Conversion API        | ⏳ Planned   |
| 6     | CRM automation                           | ⏳ Planned   |
| 7     | A/B testing, SEO, optimization           | ⏳ Planned   |

---

## Directory Structure

```
/
├── app/
│   ├── layout.tsx          ← Global layout. Init attribution + scroll tracking here.
│   ├── page.tsx            ← Homepage
│   └── api/
│       └── contact/
│           └── route.ts    ← Single API endpoint for all lead submissions
├── components/
│   ├── Hero.tsx            ← Mini lead form (name + phone)
│   ├── ContactForm.tsx     ← Full lead form
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── TrustStrip.tsx
│   ├── PromiseSection.tsx
│   ├── HowItWorks.tsx
│   ├── ServicesGrid.tsx
│   ├── FAQAccordion.tsx
│   ├── CTASection.tsx
│   ├── StickyCTA.tsx       ← Phase 4B (mobile, appears after 20% scroll)
│   ├── ScrollCTA.tsx       ← Phase 4B (desktop, appears after 60% scroll)
│   └── ViberButton.tsx     ← Phase 4B (floating bottom-right)
├── lib/
│   ├── cookies.ts          ← Cookie read/write with localStorage fallback
│   ├── attribution.ts      ← UTM capture, first/last touch logic
│   └── events.ts           ← Lightweight event tracking (console.log only until Phase 5)
└── CLAUDE.md               ← You are here
```

---

## API Route: /api/contact

**Single endpoint for all lead submissions.**

### Accepted fields

```typescript
// Core (mini form)
name: string        // required
phone: string       // required

// Extended (full form)
email?: string
type?: "electricity" | "gas" | "telecom" | "all"
provider?: string
monthly_bill?: string
referral?: string
message?: string

// Attribution (Phase 4A — optional, injected by forms)
attribution?: {
  first_touch?: {
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    referrer, landing_page, timestamp
  }
  last_touch?: {
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    referrer, landing_page, timestamp
  }
}

// Spam protection
website?: string    // honeypot — must be empty
```

### Security (do not remove)
- Rate limit: 5 requests / 10 min / IP
- Honeypot field: `website`
- HTML escape on all string inputs
- Email format validation

### Outputs
1. Internal notification email (Resend) → includes attribution table
2. Customer auto-reply email (Resend)
3. Google Sheets webhook POST → includes attribution columns

---

## lib/attribution.ts

```typescript
initAttribution()   // Call in layout.tsx useEffect — captures UTMs + referrer
getAttribution()    // Call before form submit — returns { first_touch, last_touch }
```

**Rules:**
- First touch: stored once, never overwritten
- Last touch: updated only when UTMs are present in URL
- Storage: cookie `theslyseis_attribution` (30 days) → localStorage fallback

---

## lib/events.ts

```typescript
trackEvent(name: EventName, payload?: EventPayload)
initScrollTracking()  // Returns cleanup function — call in useEffect
```

**Currently:** `console.log` in development only.
**Phase 5:** replace dispatch() body with GA4 + Meta Pixel calls.

### Event names
```
page_view
scroll_25 / scroll_50 / scroll_75
cta_sticky_view / cta_sticky_click
cta_scroll_view / cta_scroll_click
viber_view / viber_click / viber_fallback_tel / viber_copy_message
mini_submit_success / full_submit_success
```

---

## Form Submission Pattern

Both `Hero.tsx` (mini form) and `ContactForm.tsx` (full form) must:

1. Import `getAttribution` from `lib/attribution.ts`
2. Call `getAttribution()` on submit
3. Include `attribution` in the POST body to `/api/contact`
4. Call `trackEvent("mini_submit_success")` or `trackEvent("full_submit_success")` on success

```typescript
// Example — inside submit handler
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/events";

const attribution = getAttribution();

const res = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name,
    phone,
    // ...other fields...
    attribution,        // may be null — API handles gracefully
  }),
});

if (res.ok) {
  trackEvent("mini_submit_success");
}
```

---

## layout.tsx Integration (Phase 4A)

Add this `useEffect` to the root layout (must be a Client Component or extracted into a small client wrapper):

```typescript
"use client";
import { useEffect } from "react";
import { initAttribution } from "@/lib/attribution";
import { initScrollTracking, trackEvent } from "@/lib/events";

useEffect(() => {
  initAttribution();
  trackEvent("page_view");
  const cleanup = initScrollTracking();
  return cleanup;
}, []);
```

If `layout.tsx` is a Server Component, extract this into `/components/AnalyticsInit.tsx`
as a small `"use client"` component and render it inside the layout.

---

## Phase 4B Reference (not yet built)

### StickyCTA.tsx
- Mobile only (`<md` breakpoint)
- Visible after 20% scroll
- CTA: "Δωρεάν Έλεγχος" → scrolls to mini form
- Tracks: `cta_sticky_view`, `cta_sticky_click`

### ScrollCTA.tsx
- Desktop only (`≥md`)
- Visible after 60% scroll, hidden if form submitted
- Slim strip at bottom
- Tracks: `cta_scroll_view`, `cta_scroll_click`

### ViberButton.tsx
- Fixed bottom-right, above sticky CTA
- Viber deep link: `viber://chat?number=%2B306932642952`
- Fallback: `tel:+306932642952`
- Prefilled message: `"Γεια σας! Θα ήθελα δωρεάν έλεγχο για ρεύμα/αέριο. Μπορείτε να με καλέσετε;"`
- Secondary phone: 2311825327
- Tracks: `viber_view`, `viber_click`, `viber_fallback_tel`, `viber_copy_message`

---

## Key Constraints — Always Respect

1. **No UI libraries** (no shadcn, no radix, no headlessui)
2. **No Framer Motion** — CSS transitions only
3. **No external analytics** until Phase 5
4. **No new API endpoints** — everything goes to `/api/contact`
5. **No database** — Google Sheets is the store
6. **TypeScript strict** — no `any` unless absolutely unavoidable
7. **Attribution fields are always optional** — never block a submission if attribution is missing
8. **Webhook failure must never block lead submission** — wrap in try/catch

---

## Contact Info (used in components)

```
Viber / Phone: +30 6932642952
Landline:      2311825327
```

---

## Environment Variables Required

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
GOOGLE_SHEETS_WEBHOOK_URL=
```
