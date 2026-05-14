"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/events";

const VIBER_LINK = "viber://chat?number=%2B306932642952";

export default function ViberButton() {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (!tracked) {
      trackEvent("viber_view");
      setTracked(true);
    }
  }, [tracked]);

  function handleClick() {
    trackEvent("viber_click");
    window.location.href = VIBER_LINK;
  }

  return (
    <div
      className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6 flex flex-col items-end gap-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
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
