🟣 PHASE 4 PRD – Growth Mode
Attribution + Conversion Boost + Viber CTA (30-day Cookies)
1) Στόχος

Να αυξήσουμε conversion και να αποκτήσουμε αξιόπιστο attribution για κάθε lead, με:

UTM + referrer capture

30-day persistence (cookies + fallback localStorage)

Αυτόματο injection στα forms (mini + full)

Καταγραφή σε email + Google Sheet

Sticky CTA (mobile) + Scroll CTA (desktop)

Floating Viber button με προκαθορισμένο μήνυμα

Lightweight event tracking (χωρίς GA ακόμα)

2) Scope
A. Attribution Capture (UTMs + referrer)

Να καταγράφονται κατά την πρώτη επίσκεψη ή όταν υπάρχουν UTMs στο URL:

utm_source

utm_medium

utm_campaign

utm_content

utm_term

referrer (document.referrer)

landing_page (pathname)

first_visit_ts (ISO)

last_touch_ts (ISO)

last_touch_landing (pathname)

Persistence:

Cookie 30 ημερών (primary)

localStorage fallback (αν cookies disabled)

Rules:

First-touch: αποθηκεύεται στην πρώτη επίσκεψη και δεν αλλάζει.

Last-touch: ενημερώνεται κάθε φορά που υπάρχουν UTMs (ή αλλαγή referrer).

B. Form Injection (mini + full)

Σε κάθε submit προς /api/contact να στέλνονται επιπλέον fields:

{
  "attribution": {
    "first_touch": {...},
    "last_touch": {...}
  }
}

Τα attribution fields να εμφανίζονται:

στο Internal Email (σε ξεχωριστό section “Attribution”)

στο Google Sheet (σε columns ή serialized JSON string)

C. API Route Update

Το /api/contact να αποδέχεται προαιρετικά:

attribution.first_touch.*

attribution.last_touch.*

και να τα:

κάνει escape/trim όπως τα υπόλοιπα

τα συμπεριλαμβάνει στο internal email

τα προωθεί στο webhook

(Δεν αλλάζουμε rate limit/honeypot εδώ.)

D. Conversion UX Enhancements
1) Sticky CTA (Mobile)

Sticky bottom bar μόνο σε mobile (<md)

CTA: “Δωρεάν Έλεγχος” → scroll στο mini form ή link /contact

Εμφανίζεται μετά από scroll > 20%

2) Scroll-trigger CTA (Desktop)

Μετά από scroll > 60%

Αν δεν έχει γίνει submit

Εμφανίζει slim CTA strip στο κάτω μέρος

Καθαρά CSS transitions (no framer motion).

E. Floating Viber Button

Fixed bottom-right (πάνω από sticky CTA)

Opens Viber deep link

Prefilled message:

“Γεια σας! Θα ήθελα δωρεάν έλεγχο για ρεύμα/αέριο. Μπορείτε να με καλέσετε;”

F. Lightweight Event Tracking

Να υπάρχει trackEvent(name, payload) που:

αρχικά κάνει console.log (μόνο σε development)

είναι έτοιμο να συνδεθεί αργότερα με GA/Pixel

Events:

page_view

scroll_25, scroll_50, scroll_75

cta_sticky_view, cta_sticky_click

cta_scroll_view, cta_scroll_click

viber_view, viber_click

mini_submit_success, full_submit_success

3) Τεχνική Υλοποίηση

Νέα αρχεία:

/lib/attribution.ts
/lib/cookies.ts
/lib/events.ts
/components/StickyCTA.tsx
/components/ScrollCTA.tsx
/components/ViberButton.tsx

Τροποποιήσεις:

app/layout.tsx ή app/page.tsx: init attribution capture

components/Hero.tsx: inject attribution on submit

components/ContactForm.tsx: inject attribution on submit

app/api/contact/route.ts: accept + forward attribution

4) Περιορισμοί

Όχι external analytics libraries

Όχι framer motion

Όχι database

Όχι νέος endpoint

Όλα πάνε στο /api/contact

5) Success Metrics

95% των leads να έχουν attribution data

+10–20% mobile conversion με sticky CTA

+5–10% desktop conversion με scroll CTA

Viber clicks measurable