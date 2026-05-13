import { createHash } from "crypto";

interface MetaLeadEventData {
  phone: string;
  email?: string;
  clientIp: string;
  clientUserAgent: string;
  eventSourceUrl: string;
  formType: "mini" | "full";
  attributionSource?: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function sendMetaLeadEvent(data: MetaLeadEventData): Promise<boolean> {
  const pixelId = process.env.META_CAPI_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("[meta-capi] META_CAPI_PIXEL_ID or META_CAPI_ACCESS_TOKEN is not set — skipping CAPI event.");
    return false;
  }

  try {
    const userData: Record<string, string> = {
      ph: sha256(normalizePhone(data.phone)),
      client_ip_address: data.clientIp,
      client_user_agent: data.clientUserAgent,
    };

    if (data.email) {
      userData.em = sha256(normalizeEmail(data.email));
    }

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: data.eventSourceUrl,
          action_source: "website",
          user_data: userData,
          custom_data: {
            form_type: data.formType,
            ...(data.attributionSource ? { attribution_source: data.attributionSource } : {}),
          },
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[meta-capi] Request failed (${res.status}):`, text);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[meta-capi] Unexpected error:", err);
    return false;
  }
}
