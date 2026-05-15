import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendMetaLeadEvent } from "@/lib/meta-capi";

interface TouchData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  timestamp?: string;
}
interface AttributionPayload {
  first_touch?: TouchData;
  last_touch?: TouchData;
}

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(input: string) {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeTouch(touch: Record<string, unknown> | undefined): Record<string, string> {
  if (!touch || typeof touch !== "object") return {};
  const allowed = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","referrer","landing_page","timestamp"];
  const out: Record<string, string> = {};
  for (const key of allowed) {
    const val = touch[key];
    if (typeof val === "string") out[key] = escapeHtml(val.trim().slice(0, 200));
  }
  return out;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: Request) {
  console.log("ENV CHECK:", {
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasContactEmail: !!process.env.CONTACT_EMAIL,
    hasGoogleWebhook: !!process.env.GOOGLE_SHEETS_WEBHOOK,
    hasResendFrom: !!process.env.RESEND_FROM_EMAIL,
    hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasTelegramChatId: !!process.env.TELEGRAM_CHAT_ID,
  });
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) {
      return NextResponse.json(
        { error: "Internal Server Configuration Error." },
        { status: 500 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";
    const safeIp = escapeHtml(ip);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      name,
      phone,
      email,
      type,
      provider,
      monthly_bill,
      referral,
      message,
      source,
      company_name,
      attribution,
      device_type,
      scroll_depth_at_submit,
      time_to_submit_seconds,
      lead_channel,
    } = body;

    // Honeypot check
    if (company_name && company_name.trim() !== "") {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 }
      );
    }

    // Validation
    if (!source || !["mini", "full"].includes(source)) {
      return NextResponse.json({ error: "Invalid source." }, { status: 400 });
    }

    if (!name || name.trim() === "" || !phone || phone.trim() === "") {
      return NextResponse.json(
        { error: "Name and phone are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (source === "full") {
      if (!email || email.trim() === "" || !type || type.trim() === "") {
        return NextResponse.json(
          { error: "Email and Type are required for full form." },
          { status: 400 }
        );
      }
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: "Invalid email format." },
          { status: 400 }
        );
      }
    }

    const attr = attribution as AttributionPayload | undefined;
    const firstTouch = sanitizeTouch(attr?.first_touch as Record<string, unknown>);
    const lastTouch  = sanitizeTouch(attr?.last_touch  as Record<string, unknown>);

    // Escaping
    const safeName = escapeHtml(name.trim());
    const safePhone = escapeHtml(phone.trim());
    const safeSource = escapeHtml(source.trim());
    
    // Optional fields escaping
    const safeEmail = email ? escapeHtml(email.trim()) : "";
    const safeType = type ? escapeHtml(type.trim()) : "";
    const safeProvider = provider ? escapeHtml(provider.trim()) : "";
    const safeMonthlyBill = monthly_bill ? escapeHtml(monthly_bill.trim()) : "";
    const safeReferral = referral ? escapeHtml(referral.trim()) : "";
    const safeMessage = message ? escapeHtml(message.trim()) : "";

    const sheetDeviceType =
      device_type === "mobile" || device_type === "desktop" ? device_type : "";
    const safeDeviceType = sheetDeviceType ? escapeHtml(sheetDeviceType) : "";

    let parsedScrollDepth: number | null = null;
    if (typeof scroll_depth_at_submit === "number" && Number.isFinite(scroll_depth_at_submit)) {
      parsedScrollDepth = Math.min(100, Math.max(0, Math.round(scroll_depth_at_submit)));
    } else if (typeof scroll_depth_at_submit === "string" && scroll_depth_at_submit.trim() !== "") {
      const n = parseInt(scroll_depth_at_submit, 10);
      if (Number.isFinite(n)) parsedScrollDepth = Math.min(100, Math.max(0, n));
    }
    const safeScrollDepthAtSubmit =
      parsedScrollDepth !== null ? escapeHtml(String(parsedScrollDepth)) : "";

    let parsedTimeToSubmit: number | null = null;
    if (typeof time_to_submit_seconds === "number" && Number.isFinite(time_to_submit_seconds)) {
      const v = Math.min(999999, Math.max(0, Math.round(time_to_submit_seconds)));
      if (v > 0) parsedTimeToSubmit = v;
    } else if (typeof time_to_submit_seconds === "string" && time_to_submit_seconds.trim() !== "") {
      const n = parseInt(time_to_submit_seconds, 10);
      if (Number.isFinite(n)) {
        const v = Math.min(999999, Math.max(0, n));
        if (v > 0) parsedTimeToSubmit = v;
      }
    }
    const safeTimeToSubmitSeconds =
      parsedTimeToSubmit !== null ? escapeHtml(String(parsedTimeToSubmit)) : "";

    const sheetLeadChannel =
      lead_channel === "mini_form" || lead_channel === "full_form" ? lead_channel : "";
    const safeLeadChannel = sheetLeadChannel ? escapeHtml(sheetLeadChannel) : "";

    let subject = "[MINI] Νέο Lead";
    if (safeSource === "full") {
      subject = safeType === "Επιχείρηση" ? "[BUSINESS] Νέο Lead" : "[PRIVATE] Νέο Lead";
    }

    // Format Internal HTML Ensure we use inline CSS for max-width and margin
    const internalHtml = `
      <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; border: 1px solid #eaeaec;">
          <div style="background-color: #5727A3; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px;">Νέα Εγγραφή</h2>
            <p style="margin: 5px 0 0; opacity: 0.9;">Source: ${safeSource.toUpperCase()}</p>
          </div>
          <div style="padding: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Όνομα:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeName}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Τηλέφωνο:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
              ${safeEmail ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>` : ""}
              ${safeType ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Τύπος:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeType}</td></tr>` : ""}
              ${safeProvider ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Πάροχος:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeProvider}</td></tr>` : ""}
              ${safeMonthlyBill ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Λογαριασμός:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeMonthlyBill}</td></tr>` : ""}
              ${safeReferral ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Σύσταση:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeReferral}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Συσκευή:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeDeviceType || "—"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Βάθος κύλισης (%):</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeScrollDepthAtSubmit || "—"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Χρόνος έως υποβολή (δευτ.):</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeTimeToSubmitSeconds || "—"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Κανάλι:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeLeadChannel || "—"}</td></tr>
            </table>
            
            <h2 style="color:#5727A3;font-family:sans-serif;margin-top:32px;">Attribution</h2>
            <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;">
              <tbody>
                <tr style="background:#f5f0ff;"><td style="padding:8px 12px;font-weight:600;width:40%;">First Touch Source</td><td style="padding:8px 12px;">${firstTouch.utm_source || "—"}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:600;">First Touch Campaign</td><td style="padding:8px 12px;">${firstTouch.utm_campaign || "—"}</td></tr>
                <tr style="background:#f5f0ff;"><td style="padding:8px 12px;font-weight:600;">First Touch Medium</td><td style="padding:8px 12px;">${firstTouch.utm_medium || "—"}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:600;">First Landing Page</td><td style="padding:8px 12px;">${firstTouch.landing_page || "—"}</td></tr>
                <tr style="background:#f5f0ff;"><td style="padding:8px 12px;font-weight:600;">First Visit</td><td style="padding:8px 12px;">${firstTouch.timestamp || "—"}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:600;">Last Touch Source</td><td style="padding:8px 12px;">${lastTouch.utm_source || "—"}</td></tr>
                <tr style="background:#f5f0ff;"><td style="padding:8px 12px;font-weight:600;">Last Touch Campaign</td><td style="padding:8px 12px;">${lastTouch.utm_campaign || "—"}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:600;">Last Touch Medium</td><td style="padding:8px 12px;">${lastTouch.utm_medium || "—"}</td></tr>
                <tr style="background:#f5f0ff;"><td style="padding:8px 12px;font-weight:600;">Last Landing Page</td><td style="padding:8px 12px;">${lastTouch.landing_page || "—"}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:600;">Last Touch</td><td style="padding:8px 12px;">${lastTouch.timestamp || "—"}</td></tr>
                <tr style="background:#f5f0ff;"><td style="padding:8px 12px;font-weight:600;">Referrer</td><td style="padding:8px 12px;">${firstTouch.referrer || "—"}</td></tr>
              </tbody>
            </table>
            ${safeMessage ? `
              <div style="margin-top: 20px;">
                <strong>Μήνυμα:</strong><br/>
                <p style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-top: 5px;">${safeMessage}</p>
              </div>
            ` : ""}
            <div style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
              Timestamp: ${new Date().toISOString()}<br/>
              IP Info: ${safeIp}
            </div>
          </div>
        </div>
      </div>
    `;

    // Internal sending (Blocking if fails to ensure we know lead failed)
    if (process.env.CONTACT_EMAIL && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: fromEmail,
        to: process.env.CONTACT_EMAIL,
        subject: subject,
        html: internalHtml,
      });
    }

    // Auto-reply (Non-blocking if fails)
    if (safeEmail && process.env.RESEND_API_KEY) {
      const autoReplyHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333333;">
          <h2 style="color: #5727A3; margin-bottom: 20px;">Λάβαμε το αίτημά σας!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Γεια σας ${safeName},<br/><br/>
            Ευχαριστούμε που επικοινωνήσατε με το "Θες Λύσεις". Το αίτημά σας καταχωρήθηκε επιτυχώς στο σύστημά μας.<br/><br/>
            Ένας εξειδικευμένος σύμβουλος ενέργειας θα μελετήσει τα στοιχεία σας και θα επικοινωνήσει μαζί σας σύντομα στο <strong>${safePhone}</strong>.<br/><br/>
            Για οποιαδήποτε άμεση ερώτηση, μπορείτε να μας καλέσετε στο 2311825327.<br/><br/>
            Με εκτίμηση,<br/>
            Η ομάδα του Θες Λύσεις
          </p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: fromEmail,
          to: safeEmail,
          subject: "Λάβαμε το αίτημά σας - Θες Λύσεις",
          html: autoReplyHtml,
        });
      } catch {
        // Log safe non-PII error object
        console.error("Auto-reply delivery failed structurally.");
      }
    }

    // Webhook Logging (Fire and Forget)
    if (process.env.GOOGLE_SHEETS_WEBHOOK) {
      // Do not await, do not log exception details
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name: safeName,
          phone: safePhone,
          email: safeEmail,
          type: safeType,
          provider: safeProvider,
          monthly_bill: safeMonthlyBill,
          referral: safeReferral,
          message: safeMessage,
          source: safeSource,
          attribution: attribution || null,
          first_touch_source:   firstTouch.utm_source   || "",
          first_touch_medium:   firstTouch.utm_medium   || "",
          first_touch_campaign: firstTouch.utm_campaign || "",
          first_touch_landing:  firstTouch.landing_page || "",
          first_touch_ts:       firstTouch.timestamp    || "",
          last_touch_source:    lastTouch.utm_source    || "",
          last_touch_medium:    lastTouch.utm_medium    || "",
          last_touch_campaign:  lastTouch.utm_campaign  || "",
          last_touch_landing:   lastTouch.landing_page  || "",
          last_touch_ts:        lastTouch.timestamp     || "",
          referrer:             firstTouch.referrer      || "",
          device_type:            sheetDeviceType,
          scroll_depth_at_submit: parsedScrollDepth ?? "",
          time_to_submit_seconds: parsedTimeToSubmit ?? "",
          lead_channel:           sheetLeadChannel,
        }),
      }).catch(() => {});
    }

    void (async () => {
      try {
        await sendMetaLeadEvent({
          phone: phone.trim(),
          email:
            typeof email === "string" && email.trim() !== ""
              ? email.trim()
              : undefined,
          name: name.trim(),
          sourceUrl: req.headers.get("referer") ?? undefined,
        });
      } catch {
        /* never block response */
      }
    })();

    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (botToken && chatId) {
        const tgType =
          typeof type === "string" && type.trim() !== ""
            ? escapeHtml(type.trim())
            : "Μη καθορισμένο";
        const tgLeadChannel =
          typeof lead_channel === "string" && lead_channel.trim() !== ""
            ? escapeHtml(lead_channel.trim())
            : "Μη καθορισμένο";
        const tgProvider =
          typeof provider === "string" && provider.trim() !== ""
            ? escapeHtml(provider.trim())
            : "Μη καθορισμένο";
        const tgMonthlyBill =
          typeof monthly_bill === "string" && monthly_bill.trim() !== ""
            ? escapeHtml(monthly_bill.trim())
            : "Μη καθορισμένο";

        const telegramText = [
          "🔔 <b>Νέο Lead!</b>",
          "",
          `👤 <b>Όνομα:</b> ${safeName}`,
          `📞 <b>Τηλέφωνο:</b> ${safePhone}`,
          `⚡ <b>Υπηρεσία:</b> ${tgType}`,
          `📋 <b>Πηγή:</b> ${tgLeadChannel}`,
          `🌐 <b>Πάροχος:</b> ${tgProvider}`,
          `💶 <b>Μηνιαίος λογαριασμός:</b> ${tgMonthlyBill}`,
        ].join("\n");

        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              parse_mode: "HTML",
              text: telegramText,
            }),
          }
        );
      }
    } catch {
      /* never block response */
    }

    try {
      const validatedEmail =
          typeof email === "string" && email.trim() !== ""
            ? email.trim()
            : "";
      if (validatedEmail && process.env.RESEND_API_KEY) {
        const followUpHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333333;">
          <h2 style="color: #5727A3; margin-bottom: 20px;">Θυμηθήκαμε εσάς — Θες Λύσεις</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Γεια σας ${safeName},<br/><br/>
            Θέλαμε να σας ενημερώσουμε ότι ο σύμβουλός μας θα επικοινωνήσει μαζί σας σύντομα στο <strong>${safePhone}</strong>. Αν έχετε οποιαδήποτε ερώτηση στο μεταξύ, είμαστε στη διάθεσή σας.<br/><br/>
            Υπενθυμίζουμε ότι ο δωρεάν έλεγχος του λογαριασμού σας δεν έχει καμία δέσμευση. Απλώς μας δίνετε τον λογαριασμό σας και εμείς σας λέμε αν μπορείτε να εξοικονομήσετε χρήματα.<br/><br/>
            Μπορείτε επίσης να επικοινωνήσετε μαζί μας απευθείας στο 2311825327 ή μέσω Viber στο +30 693 264 2952.<br/><br/>
            Με εκτίμηση,<br/>
            Η ομάδα του Θες Λύσεις
          </p>
        </div>
      `;

        await resend.emails.send({
          from: "noreply@theslyseis.gr",
          to: validatedEmail,
          subject: "Θυμηθήκαμε εσάς — Θες Λύσεις",
          html: followUpHtml,
          scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        });
      }
    } catch {
      /* never block response */
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
