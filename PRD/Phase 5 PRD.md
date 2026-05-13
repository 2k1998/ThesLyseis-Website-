🟣 PHASE 5 PRD — Analytics & Ad Intelligence
1. Στόχος
Να συνδέσουμε το site με GA4 και Meta Pixel ώστε να:

Μετράμε ακριβώς πού χάνουμε και πού κερδίζουμε leads
Τρέχουμε Meta ads με αξιόπιστα conversion signals
Παρακάμπτουμε ad blockers μέσω server-side events
Έχουμε data για να παίρνουμε αποφάσεις στο Phase 7 (A/B testing, optimization)


2. Scope
A. GA4 Integration
Εγκατάσταση GA4 μέσω Google Tag Manager ή direct script.
Events που θέλουμε να στέλνουμε στο GA4:
EventTriggerpage_viewΚάθε page loadscroll_depth25%, 50%, 75% scrollform_startΠρώτο keystroke σε οποιοδήποτε form fieldform_submitΕπιτυχές submit (mini ή full)viber_clickClick στο Viber buttoncta_clickClick σε StickyCTA ή ScrollCTA
Το trackEvent από το lib/events.ts (Phase 4A) είναι ήδη έτοιμο — απλά προσθέτουμε gtag() calls μέσα στο dispatch().
Conversion event στο GA4: form_submit

B. Meta Pixel (Client-side)
Εγκατάσταση Meta Pixel μέσω script στο layout.
Standard events:
Pixel EventTriggerPageViewΚάθε page loadViewContentΜετά από 50% scrollLeadΕπιτυχές form submitContactViber button click

C. Meta Conversion API (Server-side)
Server-side POST από το /api/contact προς το Meta Conversions API αμέσως μετά το επιτυχές submit.
Γιατί: τα client-side pixels μπλοκάρονται από ad blockers (~30-40% των χρηστών). Το Conversion API στέλνει το event απευθείας από τον server μας στο Meta, παρακάμπτοντας αυτό.
Δεδομένα που στέλνουμε:
event_name: "Lead"
event_time: unix timestamp
user_data:
  - phone (hashed SHA256)
  - email (hashed SHA256, αν υπάρχει)
  - client_ip_address
  - client_user_agent
custom_data:
  - form_type (mini / full)
  - attribution source
event_source_url: landing page URL
Κανόνες:

PII (phone, email) στέλνεται πάντα hashed — ποτέ plaintext
Αποτυχία του Conversion API δεν μπλοκάρει το submit
Γίνεται μετά το Google Sheets webhook, στο τέλος του handler


D. Lead Quality Signals
Μαζί με το form submit, να συλλέγουμε και να στέλνουμε στο Google Sheet:
SignalΠώςdevice_typemobile / desktop από user agentscroll_depth_at_submit% scroll τη στιγμή του submittime_to_submit_secondsΧρόνος από page load έως submitlead_channel"mini_form" / "full_form"
Αυτά βοηθούν να καταλάβουμε ποιοι leads είναι πιο qualified.

3. Νέα Αρχεία
/lib/analytics.ts         ← GA4 + Pixel init και event helpers
/lib/meta-capi.ts         ← Server-side Conversion API client
4. Τροποποιήσεις
app/layout.tsx            ← GA4 + Pixel scripts
lib/events.ts             ← Plug GA4 + Pixel into dispatch()
components/Hero.tsx       ← Track form_start, send quality signals
components/ContactForm.tsx← Track form_start, send quality signals
app/api/contact/route.ts  ← Call Meta CAPI + collect quality signals
5. Νέες Env Variables
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
META_CAPI_PIXEL_ID=

6. Περιορισμοί

Όχι GTM (Google Tag Manager) — direct script για μικρότερο overhead
Όχι third-party analytics packages — native gtag και fbq μόνο
PII hashing γίνεται server-side πάντα — ποτέ στον client
Conversion API failure δεν επηρεάζει ποτέ το lead submission flow
Τα lib/events.ts event names δεν αλλάζουν — απλά προσθέτουμε τα calls


7. Success Metrics

GA4 λαμβάνει 100% των page views και form submits
Meta Pixel + CAPI rate > 90% match rate στο Events Manager
Lead quality signals εμφανίζονται σε κάθε row του Google Sheet
Zero impact σε form submission speed