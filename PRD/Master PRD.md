1. Overview
Product Name:

Θες Λύσεις – Corporate Website

Objective:

Δημιουργία premium, minimal, high-converting corporate website που:

Τοποθετεί τη Θες Λύσεις ως θεσμικό ενεργειακό σύμβουλο

Αναδεικνύει 700+ πελάτες από το 2019

Προσφέρει Δωρεάν Έλεγχο Λογαριασμού

Υποστηρίζει Organic, Paid Ads & Referral traffic

Είναι έτοιμο για scale

Δεν χρησιμοποιεί database ή εξωτερικό CRM

2. Tech Stack (Mandatory)

Next.js 14+ (App Router)

TypeScript

TailwindCSS

Framer Motion

Resend (email sending)

Vercel deployment

No database

No CMS

No external UI libraries

3. Folder Structure (Strict)
/app
  layout.tsx
  page.tsx
  /about/page.tsx
  /services/page.tsx
  /contact/page.tsx
  /free-check/page.tsx
  /api/contact/route.ts

/components
  Navbar.tsx
  Footer.tsx
  Hero.tsx
  TrustStrip.tsx
  PromiseSection.tsx
  HowItWorks.tsx
  ServicesGrid.tsx
  FAQAccordion.tsx
  ContactForm.tsx
  ThemeToggle.tsx
  ViberButton.tsx
  Container.tsx

/lib
  resend.ts
  utils.ts

4. Brand & Design System
Design Philosophy

Apple-style whitespace

Premium minimal

Clean layout

Large typography

Subtle animations

Corporate without faces

Colors

Primary:

#000000

#5727A3

Supporting:

#9153F4

#D6C5F0

#9E9E96

#FFFFFF

Layout Rules

Container:

max-w-[1200px]

px-6 md:px-8

mx-auto

Section spacing:

Desktop: py-24

Mobile: py-16

5. Light / Dark Mode

Default: Dark

Tailwind darkMode: "class"

Store in localStorage

Detect system preference

Smooth transition (0.4s)

Fully accessible toggle

6. Homepage Structure (Strict Order)
Navbar
Hero
TrustStrip
PromiseSection
HowItWorks
ServicesGrid
FAQAccordion
Final CTA Section
Footer
ViberButton

7. Homepage Content
Hero

H1:
Ο προσωπικός σας σύμβουλος ενέργειας.

Sub:
Παρακολουθούμε την αγορά για εσάς. Σας ενημερώνουμε μόνο όταν συμφέρει. Χωρίς κόστος.

Mini Form:

Όνομα (required)

Τηλέφωνο (required)

CTA:
Θέλω Δωρεάν Έλεγχο

TrustStrip

700+ πελάτες

Από το 2019

0€ κόστος για τον πελάτη

Subtle animated counter allowed.

PromiseSection

✓ Δεν πληρώνετε τίποτα
✓ Δεν δεσμεύεστε
✓ Παρακολουθούμε την αγορά κάθε μήνα

HowItWorks

Καταχωρείτε τα στοιχεία σας

Ελέγχουμε την αγορά

Σας ενημερώνουμε όταν υπάρχει καλύτερη λύση

ServicesGrid

Ηλεκτρική Ενέργεια

Φυσικό Αέριο

Σταθερή & Κινητή Τηλεφωνία

Copy emphasis:
Αναλαμβάνουμε ολόκληρο το ενεργειακό και τηλεπικοινωνιακό σας προφίλ.

FAQ

Πληρώνω κάτι για τον έλεγχο;

Υπάρχει κάποια δέσμευση;

Πώς κερδίζει η εταιρεία;

Πόσο γρήγορα θα επικοινωνήσετε;

Αν δεν με συμφέρει αλλαγή;

Accordion style.

8. Contact Page Form Fields

Όνομα (required)

Email (required)

Τηλέφωνο (required)

Ιδιώτης / Επιχείρηση (required)

Πάροχος σήμερα

Μέσος μηνιαίος λογαριασμός (optional)

Σε σύστησε κάποιος;

Μήνυμα

Hidden honeypot field

9. API Logic

POST → /api/contact

Validation:

Reject if honeypot filled

Reject missing required

Basic rate limiting

Email routing:

Επιχείρηση → [BUSINESS]

Ιδιώτης → [PRIVATE]

Mini form → [MINI]

Referral → append to email body

Send:

Internal email

Auto-reply email

10. Animations (Strict Constraints)

Allowed:

Fade in

Slide up (y: 20 → 0)

Stagger

Duration 0.4–0.6s

easeInOut

Not allowed:

Bounce

Parallax

Scroll hijacking

Heavy motion

Respect reduced motion preference.

11. Viber Button

Fixed bottom-right

Purple circle

Subtle pulse every 8 seconds

Accessible label

Mobile optimized

12. SEO

Each page must include:

Unique title

Meta description

Open Graph

Canonical

JSON-LD Organization schema

Homepage title:
Θες Λύσεις | Προσωπικός Σύμβουλος Ενέργειας

13. Performance

Lighthouse > 90

Use next/image

Lazy load non-critical sections

No heavy assets

14. Dedicated Landing Page

Route: /free-check

Contains:

Hero

TrustStrip

Mini Form

Final CTA

Optimized for paid ads.

END OF PRD