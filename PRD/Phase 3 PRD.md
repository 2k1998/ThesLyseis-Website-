🟣 PHASE 3 PRD
Conversion Infrastructure – Θες Λύσεις
1️⃣ Overview
Feature Name

Conversion & Lead Processing System

Objective

Να υλοποιηθεί πλήρης μηχανισμός διαχείρισης leads που:

Συλλέγει δεδομένα από mini form & full contact form

Στέλνει επαγγελματικά HTML emails

Στέλνει auto-reply στους πελάτες

Καταγράφει τα leads σε Google Sheets

Περιλαμβάνει anti-spam & rate limiting

Δεν χρησιμοποιεί database

Είναι production-ready και scalable

2️⃣ TL;DR

Χτίζουμε:

Ένα unified endpoint /api/contact

Email delivery μέσω Resend

Lead logging σε Google Sheets

HTML corporate email templates

Honeypot + rate limiting

Clean UX state management

Χωρίς database. Χωρίς CRM. Χωρίς SaaS marketing tool.

3️⃣ Goals
🎯 Business Goals

Αύξηση conversion reliability

Μηδενική απώλεια leads

Επαγγελματική εικόνα μέσω branded email

Καταγραφή referral source

Data visibility για future optimization

👤 User Goals

Να λάβει άμεση επιβεβαίωση

Να νιώσει ασφάλεια

Να μην υπάρξει friction

Να μην ανανεωθεί η σελίδα

Να λάβει professional απάντηση

🚫 Non-Goals

Δεν υλοποιείται CMS

Δεν υλοποιείται database

Δεν υλοποιείται dashboard

Δεν υλοποιείται CRM

Δεν υλοποιούνται automations beyond email + sheet logging

4️⃣ User Stories
🟢 Mini Form

Ως επισκέπτης
Θέλω να δώσω όνομα & τηλέφωνο
Ώστε να με καλέσουν για δωρεάν έλεγχο.

🟢 Full Contact Form

Ως πελάτης
Θέλω να συμπληρώσω πλήρη στοιχεία
Ώστε να λάβω πιο στοχευμένη πρόταση.

🟢 Admin

Ως εταιρεία
Θέλω να λαμβάνω οργανωμένο email
Ώστε να επικοινωνώ άμεσα.

🟢 Data Tracking

Ως επιχείρηση
Θέλω να καταγράφονται όλα τα leads
Ώστε να βλέπω referrals & trends.

5️⃣ Architecture
Unified Endpoint
POST /api/contact
Request Schema
{
  name: string
  phone: string
  email?: string
  type?: "Ιδιώτης" | "Επιχείρηση"
  provider?: string
  monthly_bill?: string
  referral?: string
  message?: string
  source: "mini" | "full"
  company_name?: string
}
6️⃣ Validation Logic

If source === "mini":

name required

phone required

If source === "full":

name required

phone required

email required

type required

Reject if:

Honeypot filled

Rate limit exceeded

Required fields missing

7️⃣ Security
Honeypot

Hidden field:

company_name

If not empty → reject silently.

Rate Limiting

5 submissions per IP

10 minute window

In-memory Map

No external libraries

Sanitization

Trim whitespace

Remove script tags

No logging sensitive data

8️⃣ Email Strategy (Resend)
Internal Email

HTML Layout:

White background

Primary header bar

Structured data table

Source badge (MINI / BUSINESS / PRIVATE)

Timestamp

Clean typography

Subject Rules:

[MINI] Νέο Lead
[BUSINESS] Νέο Lead
[PRIVATE] Νέο Lead
Auto Reply Email

HTML Layout:

White minimal corporate design

Thank you message

Confirmation of submission

Contact phone

Professional tone only

Subject:

Λάβαμε το αίτημά σας
9️⃣ Google Sheets Logging

POST to:

process.env.GOOGLE_SHEETS_WEBHOOK

Body:

{
  timestamp,
  name,
  phone,
  email,
  type,
  provider,
  monthly_bill,
  referral,
  message,
  source
}

Webhook failure must NOT block lead success.

🔟 UX Flow

On Submit:

Button disabled

Spinner visible

Await API response

On success:

Replace form with success box

On error:

Inline error message

No page reload

1️⃣1️⃣ Technical Considerations

Serverless function via Next.js App Router

No database

Environment variables required

Must not expose secrets client-side

Error responses structured JSON

1️⃣2️⃣ Milestones & Sequencing
Phase 3A – API Foundation (XX weeks)

Create route

Add validation

Add rate limit

Test JSON responses

Phase 3B – Email Integration (XX weeks)

Install Resend

Create HTML templates

Test delivery

Phase 3C – Google Sheets Logging (XX weeks)

Create webhook

Integrate logging

Test non-blocking behavior

Phase 3D – Frontend Wiring (XX weeks)

Connect mini form

Connect full form

Add loading states

Add success/error UX

1️⃣3️⃣ Success Metrics

100% delivery of valid submissions

0 unlogged leads

<1% rate-limit false positives

<2s API response time

No page reloads

1️⃣4️⃣ Narrative (Executive Story)

Η Θες Λύσεις δεν είναι απλά ένα site.
Είναι σύστημα.

Με το Phase 3:

Κάθε lead καταγράφεται

Κάθε πελάτης λαμβάνει επαγγελματική απάντηση

Κάθε referral μετριέται

Κάθε submission προστατεύεται

Χωρίς CRM.
Χωρίς SaaS dependency.
Χωρίς database complexity.

Αυτό δημιουργεί υποδομή scale με ελάχιστο operational βάρος.