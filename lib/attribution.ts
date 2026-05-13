import { getCookie, setCookie, deleteCookie } from "./cookies";

const COOKIE_NAME = "theslyseis_attribution";

export interface TouchData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
  landing_page: string;
  timestamp: string;
}

export interface AttributionData {
  first_touch: TouchData;
  last_touch: TouchData;
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_content: params.get("utm_content") ?? "",
    utm_term: params.get("utm_term") ?? "",
  };
}

function hasUtms(utms: Record<string, string>): boolean {
  return Object.values(utms).some((v) => v !== "");
}

function buildTouchData(utms: Record<string, string>): TouchData {
  return {
    utm_source: utms.utm_source ?? "",
    utm_medium: utms.utm_medium ?? "",
    utm_campaign: utms.utm_campaign ?? "",
    utm_content: utms.utm_content ?? "",
    utm_term: utms.utm_term ?? "",
    referrer: typeof document !== "undefined" ? document.referrer ?? "" : "",
    landing_page: typeof window !== "undefined" ? window.location.pathname ?? "" : "",
    timestamp: new Date().toISOString(),
  };
}

function readStored(): AttributionData | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}

function writeStored(data: AttributionData): void {
  setCookie(COOKIE_NAME, JSON.stringify(data));
}

export function initAttribution(): void {
  if (typeof window === "undefined") return;
  const utms = getUtmParams();
  const existing = readStored();
  const touch = buildTouchData(utms);
  if (!existing) {
    writeStored({ first_touch: touch, last_touch: touch });
    return;
  }
  if (hasUtms(utms)) {
    writeStored({ first_touch: existing.first_touch, last_touch: touch });
  }
}

export function getAttribution(): AttributionData | null {
  return readStored();
}

export function clearAttribution(): void {
  if (typeof window === "undefined") return;
  deleteCookie(COOKIE_NAME);
}
