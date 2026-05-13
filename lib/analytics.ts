declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[][];
      loaded: boolean;
      version: string;
      push: (...args: unknown[]) => void;
    };
    _fbq: Window["fbq"];
  }
}

/** Called on mount from `AnalyticsInit`. GA4 / Meta base tags load via `next/script` in `app/layout.tsx`. */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
}

export function sendGA4Event(
  name: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function sendPixelEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", name, params);
}

export default initAnalytics;
