import { sendGA4Event, sendPixelEvent } from "@/lib/analytics";

export type EventName =
  | "page_view"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "cta_sticky_view"
  | "cta_sticky_click"
  | "cta_scroll_view"
  | "cta_scroll_click"
  | "viber_view"
  | "viber_click"
  | "viber_fallback_tel"
  | "viber_copy_message"
  | "mini_submit_success"
  | "full_submit_success"
  | "form_start";

export type EventPayload = Record<string, string | number | boolean>;

function dispatch(name: EventName, payload?: EventPayload): void {
  // Phase 5: gtag("event", name, payload);
  // Phase 5: fbq("track", name, payload);
  if (process.env.NODE_ENV === "development") {
    console.log(`[event] ${name}`, payload ?? {});
  }

  const base = payload ?? {};

  switch (name) {
    case "page_view":
      sendGA4Event("page_view", base);
      sendPixelEvent("PageView", base);
      break;
    case "scroll_25":
      sendGA4Event("scroll_depth", { ...base, percent: 25 });
      break;
    case "scroll_50":
      sendGA4Event("scroll_depth", { ...base, percent: 50 });
      sendPixelEvent("ViewContent", base);
      break;
    case "scroll_75":
      sendGA4Event("scroll_depth", { ...base, percent: 75 });
      break;
    case "mini_submit_success":
      sendGA4Event("form_submit", { ...base, form_type: "mini" });
      sendPixelEvent("Lead", { ...base, form_type: "mini" });
      break;
    case "full_submit_success":
      sendGA4Event("form_submit", { ...base, form_type: "full" });
      sendPixelEvent("Lead", { ...base, form_type: "full" });
      break;
    case "viber_click":
      sendGA4Event("viber_click", base);
      sendPixelEvent("Contact", base);
      break;
    case "cta_sticky_click":
    case "cta_scroll_click":
      sendGA4Event("cta_click", base);
      break;
    default:
      sendGA4Event(name, base);
      break;
  }
}

export function trackEvent(name: EventName, payload?: EventPayload): void {
  if (typeof window === "undefined") return;
  dispatch(name, payload);
}

export function initScrollTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  const fired = new Set<EventName>();
  function onScroll() {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const pct = Math.round(scrolled * 100);
    if (pct >= 25 && !fired.has("scroll_25")) { fired.add("scroll_25"); trackEvent("scroll_25"); }
    if (pct >= 50 && !fired.has("scroll_50")) { fired.add("scroll_50"); trackEvent("scroll_50"); }
    if (pct >= 75 && !fired.has("scroll_75")) { fired.add("scroll_75"); trackEvent("scroll_75"); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
