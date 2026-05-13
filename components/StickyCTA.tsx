"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/events";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= 0.2) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (visible && !tracked) {
      trackEvent("cta_sticky_view");
      setTracked(true);
    }
  }, [visible, tracked]);

  function handleClick() {
    trackEvent("cta_sticky_click");
    const form = document.getElementById("mini-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.href = "/contact";
    }
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        flex md:hidden
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        onClick={handleClick}
        className="w-full py-4 text-white font-semibold text-base tracking-wide"
        style={{ background: "linear-gradient(135deg, #5727A3, #9153F4)" }}
      >
        Δωρεάν Έλεγχος →
      </button>
    </div>
  );
}
