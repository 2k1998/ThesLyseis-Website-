import { createHash } from "node:crypto";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function sendMetaLeadEvent(data: {
  phone?: string;
  email?: string;
  name?: string;
  sourceUrl?: string;
}): Promise<boolean> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.META_CAPI_PIXEL_ID;

  if (!accessToken || !pixelId) return false;

  try {
    const userData: Record<string, string> = {};

    if (data.phone) {
      userData.ph = sha256(data.phone.toLowerCase().trim());
    }
    if (data.email) {
      userData.em = sha256(data.email.toLowerCase().trim());
    }
    if (data.name) {
      userData.fn = sha256(data.name.toLowerCase().trim());
    }

    const event: Record<string, unknown> = {
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: userData,
    };

    if (data.sourceUrl) {
      event.event_source_url = data.sourceUrl;
    }

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event] }),
      }
    );

    return res.ok;
  } catch {
    return false;
  }
}
