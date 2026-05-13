🟣 PHASE 1 – PRD
Θεμελίωση Project & Design System
1️⃣ Στόχος Phase 1

Να δημιουργηθεί η τεχνική και σχεδιαστική βάση του project:

Ρύθμιση Next.js project

Ρύθμιση Tailwind

Ενεργοποίηση Dark/Light mode

Δημιουργία βασικού layout

Δημιουργία Navbar & Footer

Δημιουργία reusable Container component

❗ Σε αυτό το phase ΔΕΝ υλοποιούμε περιεχόμενο, φόρμες ή animations.

2️⃣ Τεχνολογίες (Υποχρεωτικά)

Next.js 14+ (App Router)

TypeScript

TailwindCSS

Χωρίς εξωτερικές UI βιβλιοθήκες

Χωρίς Framer Motion (θα μπει σε επόμενο phase)

3️⃣ Δομή Φακέλων (Αυστηρή)

Να δημιουργηθεί η εξής δομή:

/app
  layout.tsx
  page.tsx

/components
  Navbar.tsx
  Footer.tsx
  ThemeToggle.tsx
  Container.tsx

/lib
  utils.ts


Δεν προσθέτουμε άλλους φακέλους ή σελίδες σε αυτό το phase.

4️⃣ Layout.tsx – Προδιαγραφές

Το layout.tsx πρέπει:

Να εφαρμόζει default Dark Mode

Να περιλαμβάνει smooth transition μεταξύ themes

Να περιλαμβάνει Navbar και Footer

Να έχει βασικά metadata

Να περιλαμβάνει placeholder JSON-LD script (Organization schema placeholder)

Να μην προκαλεί hydration flicker

Στο <html> να υπάρχει:

class="dark"

transition-colors duration-400

5️⃣ Tailwind Configuration

darkMode: "class"

Να οριστούν custom color tokens:

primary: #5727A3
primary-light: #9153F4
primary-soft: #D6C5F0
neutral-gray: #9E9E96
black: #000000
white: #FFFFFF

6️⃣ Design System Κανόνες
Container Component

max-w-[1200px]

mx-auto

px-6 md:px-8

Να χρησιμοποιείται παντού.

Section Spacing (Global Rule)

Desktop:

py-24

Mobile:

py-16

Typography Base

Να οριστεί βασική κλίμακα για:

H1

H2

body text

(δεν χρειάζεται content ακόμα, μόνο έτοιμο σύστημα)

7️⃣ ThemeToggle Component

Προδιαγραφές:

Κουμπί με icon (ή placeholder text)

Αλλάζει μεταξύ light και dark

Αποθηκεύει επιλογή σε localStorage

Αν δεν υπάρχει επιλογή → χρησιμοποιεί system preference

Να είναι πλήρως προσβάσιμο (aria-label)

Να μην δημιουργεί hydration mismatch

Smooth transition 0.4s

8️⃣ Navbar Component

Πρέπει να περιλαμβάνει:

Placeholder logo (text)

Placeholder navigation links

ThemeToggle

Placeholder CTA button

Responsive layout (mobile & desktop)

Δεν χρειάζονται λειτουργικά links ακόμα.

9️⃣ Footer Component

Minimal layout:

Όνομα εταιρείας (placeholder)

Copyright

Καθαρό spacing

🔟 Περιορισμοί Phase 1

ΜΗΝ υλοποιήσεις:

Framer Motion

Animations

Forms

API routes

Landing pages

Viber button

SEO ανά σελίδα

Επιπλέον components

🎯 Παραδοτέο Phase 1

Λειτουργικό project

Dark mode default

Toggle λειτουργικό

Responsive layout

Καθαρό foundation

Lighthouse > 90

Χωρίς runtime errors