"use client";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies";

const CONSENT_COOKIE = "theslyseis_consent";
const SHOW_DELAY_MS = 1500;

function updateGtagConsent(granted: boolean): void {
  const storage = granted ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: storage,
    ad_storage: storage,
  });
}

export default function CookieBanner() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (getCookie(CONSENT_COOKIE)) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldRender(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [shouldRender]);

  function handleChoice(value: "granted" | "denied"): void {
    setCookie(CONSENT_COOKIE, value);
    updateGtagConsent(value === "granted");
    setIsVisible(false);
    window.setTimeout(() => setShouldRender(false), 300);
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-live="polite"
      className={`fixed bottom-28 right-4 z-50 max-w-sm rounded-2xl border border-card-border bg-card p-5 shadow-xl transition-all duration-300 md:bottom-24 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <h2
        id="cookie-banner-title"
        className="mb-2 text-sm font-semibold text-foreground"
      >
        Χρήση Cookies
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-foreground-muted">
        Χρησιμοποιούμε cookies για ανάλυση επισκεψιμότητας και βελτίωση της
        εμπειρίας σας.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleChoice("denied")}
          className="flex-1 rounded-xl border border-card-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground/5"
        >
          Απόρριψη
        </button>
        <button
          type="button"
          onClick={() => handleChoice("granted")}
          className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-light"
        >
          Αποδοχή
        </button>
      </div>
    </div>
  );
}
