"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/events";

export default function ScrollCTA() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= 0.6 && !submitted) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [submitted]);

  useEffect(() => {
    function onSubmitSuccess() {
      setSubmitted(true);
      setVisible(false);
    }
    window.addEventListener("theslyseis:submitted", onSubmitSuccess);
    return () => window.removeEventListener("theslyseis:submitted", onSubmitSuccess);
  }, []);

  useEffect(() => {
    if (visible && !tracked) {
      trackEvent("cta_scroll_view");
      setTracked(true);
    }
  }, [visible, tracked]);

  function handleClick() {
    trackEvent("cta_scroll_click");
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
        fixed bottom-0 left-0 right-0 z-40
        hidden md:flex items-center justify-between
        px-8 py-4
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ background: "linear-gradient(135deg, #5727A3, #9153F4)" }}
    >
      <p className="text-white font-medium text-sm">
        Εξοικονομήστε στον λογαριασμό ενέργειάς σας — δωρεάν, χωρίς δεσμεύσεις.
      </p>
      <button
        onClick={handleClick}
        className="ml-8 shrink-0 bg-background text-[#5727A3] font-semibold text-sm px-6 py-2 rounded-full hover:bg-background-secondary transition-colors duration-200"
      >
        Δωρεάν Έλεγχος →
      </button>
    </div>
  );
}
