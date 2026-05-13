"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/events";

const VIBER_NUMBER = "+306932642952";
const VIBER_NUMBER_ENCODED = "%2B306932642952";
const PREFILLED_MESSAGE = "Γεια σας! Θα ήθελα δωρεάν έλεγχο για ρεύμα/αέριο. Μπορείτε να με καλέσετε;";
const VIBER_LINK = `viber://chat?number=${VIBER_NUMBER_ENCODED}`;
const TEL_LINK = `tel:${VIBER_NUMBER}`;

export default function ViberButton() {
  const [tracked, setTracked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isViber, setIsViber] = useState(true);

  useEffect(() => {
    // Detect if likely on a desktop (no Viber app) — show tel fallback
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod/.test(ua);
    setIsViber(isMobile);

    if (!tracked) {
      trackEvent("viber_view");
      setTracked(true);
    }
  }, [tracked]);

  function handleClick() {
    if (isViber) {
      trackEvent("viber_click");
      window.location.href = VIBER_LINK;

      // Fallback: if Viber doesn't open in 1.5s, copy message to clipboard
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText(PREFILLED_MESSAGE);
          trackEvent("viber_copy_message");
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch {}
      }, 1500);
    } else {
      trackEvent("viber_fallback_tel");
      window.location.href = TEL_LINK;
    }
  }

  return (
    <div
      className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6 flex flex-col items-end gap-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {copied && (
        <div className="bg-black text-white text-xs px-3 py-2 rounded-lg max-w-[200px] text-center shadow-lg">
          Το μήνυμα αντιγράφηκε. Επικολλήστε το στο Viber!
        </div>
      )}
      <button
        onClick={handleClick}
        aria-label="Επικοινωνία μέσω Viber"
        className="flex items-center gap-2 px-4 py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        style={{ background: "linear-gradient(135deg, #7360f2, #5727A3)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.985 0C5.737 0 .643 4.793.643 10.696c0 3.07 1.348 5.843 3.51 7.823v3.73a.75.75 0 001.218.587l3.058-2.394a11.993 11.993 0 003.556.537c6.248 0 11.342-4.793 11.342-10.696C23.327 4.793 18.233 0 11.985 0zm.748 15.77a.75.75 0 01-.748.68c-3.9 0-7.077-3.07-7.077-6.835a.75.75 0 011.5 0c0 2.942 2.494 5.335 5.577 5.335a.75.75 0 01.748.82zm2.43 1.09a9.513 9.513 0 01-2.006-.214.75.75 0 01.316-1.467 7.99 7.99 0 001.69.18.75.75 0 010 1.5zm1.723-3.065a.75.75 0 01-.53-.22l-1.5-1.5a.75.75 0 011.06-1.06l.97.97 2.47-2.47a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-.53.22z"/>
        </svg>
        Viber
      </button>
    </div>
  );
}
