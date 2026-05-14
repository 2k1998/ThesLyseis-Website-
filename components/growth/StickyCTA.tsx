"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/events";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isSuccess) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const scrollPercentage = maxScroll > 0 ? scrollPosition / maxScroll : 0;

      if (scrollPercentage > 0.2) {
        if (!isVisible) setIsVisible(true);
        if (!hasTrackedView) {
          trackEvent("cta_sticky_view");
          setHasTrackedView(true);
        }
      } else {
        if (isVisible) setIsVisible(false);
      }
    };

    const handleFormSuccess = () => {
      setIsSuccess(true);
      setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("form_success", handleFormSuccess);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("form_success", handleFormSuccess);
    };
  }, [isVisible, hasTrackedView, isSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackEvent("cta_sticky_click");
    
    // Smooth scroll to mini form
    const formElement = document.getElementById("mini-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-card-border p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-[150%]"
      }`}
    >
      <a
        href="#mini-form"
        onClick={handleClick}
        className="block w-full text-center bg-primary hover:bg-primary-light text-white font-medium rounded-xl py-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Δωρεάν Έλεγχος
      </a>
    </div>
  );
}
