"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/events";

export default function ScrollTracker() {
  const flags = useRef({ hasFired25: false, hasFired50: false, hasFired75: false });
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrollPercent = height > 0 ? (scrollY / height) * 100 : 0;

          if (scrollPercent >= 25 && !flags.current.hasFired25) {
            flags.current.hasFired25 = true;
            trackEvent("scroll_25");
          }
          if (scrollPercent >= 50 && !flags.current.hasFired50) {
            flags.current.hasFired50 = true;
            trackEvent("scroll_50");
          }
          if (scrollPercent >= 75 && !flags.current.hasFired75) {
            flags.current.hasFired75 = true;
            trackEvent("scroll_75");
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
