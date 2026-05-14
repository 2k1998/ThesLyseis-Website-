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
  if (process.env.NODE_ENV === "development") {
    console.log(`[event] ${name}`, payload ?? {});
  }

  sendGA4Event(name, payload);

  if (name === "mini_submit_success" || name === "full_submit_success") {
    sendPixelEvent("Lead", payload);
  } else if (name === "page_view") {
    sendPixelEvent("PageView");
  } else {
    sendPixelEvent("CustomEvent", {
      event_name: name,
      ...(payload ?? {}),
    });
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
