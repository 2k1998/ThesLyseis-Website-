declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function appendToHead(node: Node): void {
  const head = document.head ?? document.documentElement;
  head.appendChild(node);
}

function initGA4(measurementId: string): void {
  if (typeof window.gtag === "function") {
    return;
  }

  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  if (document.querySelector(`script[src="${src}"]`)) {
    return;
  }

  const external = document.createElement("script");
  external.async = true;
  external.src = src;
  appendToHead(external);

  const inline = document.createElement("script");
  inline.textContent = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js', new Date());",
    `gtag('config', ${JSON.stringify(measurementId)});`,
  ].join("\n");
  appendToHead(inline);
}

function initMetaPixel(pixelId: string): void {
  if (typeof window.fbq === "function") {
    return;
  }

  if (document.querySelector('script[src*="fbevents.js"]')) {
    return;
  }

  const inline = document.createElement("script");
  inline.textContent = [
    "!function(f,b,e,v,n,t,s){",
    "if(f.fbq)return;",
    "n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};",
    "if(!f._fbq)f._fbq=n;",
    "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];",
    "t=b.createElement(e);t.async=!0;t.src=v;",
    "s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)",
    "}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');",
    `fbq('init',${JSON.stringify(pixelId)});`,
    "fbq('track','PageView');",
  ].join("");
  appendToHead(inline);
}

/**
 * Loads GA4 (gtag.js) and Meta Pixel on the client when the corresponding
 * `NEXT_PUBLIC_*` env vars are set. Never throws.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") {
    return;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  if (measurementId) {
    try {
      initGA4(measurementId);
    } catch {
      /* intentionally silent */
    }
  }

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (pixelId) {
    try {
      initMetaPixel(pixelId);
    } catch {
      /* intentionally silent */
    }
  }
}

export function sendGA4Event(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof window.gtag !== "function") {
    return;
  }
  try {
    window.gtag("event", name, params ?? {});
  } catch {
    /* intentionally silent */
  }
}

export function sendPixelEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof window.fbq !== "function") {
    return;
  }
  try {
    window.fbq("track", name, params ?? {});
  } catch {
    /* intentionally silent */
  }
}

export default initAnalytics;
