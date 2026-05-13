"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/events";

export default function ViberButton() {
  const [isOpen, setIsOpen] = useState(false);

  const mainPhone = "+306932642952";
  const secondaryPhone = "+302311825327";
  const prefilledMessage = "Γεια σας! Θα ήθελα δωρεάν έλεγχο για ρεύμα/αέριο. Μπορείτε να με καλέσετε;";
  const viberUrl = `viber://chat?number=${encodeURIComponent(mainPhone)}`;
  const telMainUrl = `tel:${mainPhone}`;
  const telSecondaryUrl = `tel:${secondaryPhone}`;

  const handleViberClick = () => {
    trackEvent("viber_click");
  };

  const handleFallbackMainClick = () => {
    trackEvent("viber_fallback_tel", { type: "main" });
  };

  const handleFallbackSecondaryClick = () => {
    trackEvent("viber_fallback_tel", { type: "secondary" });
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(prefilledMessage).then(() => {
      trackEvent("viber_copy_message");
      alert("Το μήνυμα αντιγράφηκε!");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  const toggleOpen = () => {
    if (!isOpen) {
      trackEvent("viber_view");
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-24 md:bottom-24 right-4 md:right-6 z-50 flex flex-col items-end gap-3 pb-safe">
      {/* Expanded Menu */}
      <div 
        className={`bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-3 rounded-2xl shadow-xl flex flex-col gap-2 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        <div className="text-xs text-neutral-gray mb-1 px-2">ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ</div>
        
        <a 
          href={viberUrl}
          onClick={handleViberClick}
          className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium text-[#7360F2]"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.282 10.375c-0.273-3.235-2.221-6.19-5.115-7.794C12.55 0.589 8.358 0.692 4.966 2.872 1.631 5.015-0.244 8.783 0.02 12.63c0.165 2.41 1.096 4.7 2.651 6.51l-1.397 3.905c-0.125 0.352-0.038 0.748 0.231 1 0.185 0.176 0.435 0.277 0.697 0.277 0.108 0 0.217-0.019 0.323-0.057l4.135-1.487c1.782 0.758 3.731 1.157 5.718 1.157 0.418 0 0.838-0.024 1.259-0.071 3.518-0.4 6.551-2.484 8.283-5.694 1.705-3.159 1.954-6.86 0.841-10.213l-1.478 2.42z"/><path d="M16.94 12.62c-0.342-0.232-0.782-0.106-1.123 0.088l-1.045 0.605c-0.261 0.151-0.584 0.169-0.852 0.039-1.365-0.662-2.316-1.635-2.937-3.007-0.12-0.266-0.091-0.587 0.065-0.847l0.583-1.002c0.201-0.345 0.354-0.79 0.137-1.135l-1.611-2.555c-0.316-0.5-0.893-0.556-1.362-0.236-0.898 0.61-1.666 1.481-2.073 2.607-0.472 1.309-0.208 2.864 0.749 4.385 1.543 2.457 4.102 4.298 7.025 4.966 1.536 0.352 2.977 0.155 4.162-0.569 0.992-0.606 1.666-1.503 1.996-2.502 0.223-0.677 0.045-1.242-0.403-1.547L16.94 12.62z"/>
          </svg>
          Άνοιγμα Viber
        </a>
        <button 
          onClick={handleCopyMessage}
          className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium text-black dark:text-white"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-neutral-gray" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          Αντιγραφή Μηνύματος
        </button>
        <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-2"></div>
        <a 
          href={telMainUrl}
          onClick={handleFallbackMainClick}
          className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium text-black dark:text-white"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-neutral-gray" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          Κλήση στο κινητό
        </a>
        <a 
          href={telSecondaryUrl}
          onClick={handleFallbackSecondaryClick}
          className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium text-black dark:text-white"
        >
            <svg className="w-5 h-5 flex-shrink-0 text-neutral-gray" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          Κλήση στο σταθερό
        </a>
      </div>

      {/* Main Floating Button */}
      <button 
        onClick={toggleOpen}
        className="flex items-center justify-center bg-gradient-to-tr from-[#7360F2] to-[#9153F4] text-white w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-[0_8px_30px_rgba(115,96,242,0.4)] hover:shadow-[0_12px_40px_rgba(115,96,242,0.5)] transition-all duration-300 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Επικοινωνία μέσω Viber"
      >
        {isOpen ? (
          <svg className="w-6 h-6 md:w-7 md:h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.282 10.375c-0.273-3.235-2.221-6.19-5.115-7.794C12.55 0.589 8.358 0.692 4.966 2.872 1.631 5.015-0.244 8.783 0.02 12.63c0.165 2.41 1.096 4.7 2.651 6.51l-1.397 3.905c-0.125 0.352-0.038 0.748 0.231 1 0.185 0.176 0.435 0.277 0.697 0.277 0.108 0 0.217-0.019 0.323-0.057l4.135-1.487c1.782 0.758 3.731 1.157 5.718 1.157 0.418 0 0.838-0.024 1.259-0.071 3.518-0.4 6.551-2.484 8.283-5.694 1.705-3.159 1.954-6.86 0.841-10.213l-1.478 2.42z"/><path d="M16.94 12.62c-0.342-0.232-0.782-0.106-1.123 0.088l-1.045 0.605c-0.261 0.151-0.584 0.169-0.852 0.039-1.365-0.662-2.316-1.635-2.937-3.007-0.12-0.266-0.091-0.587 0.065-0.847l0.583-1.002c0.201-0.345 0.354-0.79 0.137-1.135l-1.611-2.555c-0.316-0.5-0.893-0.556-1.362-0.236-0.898 0.61-1.666 1.481-2.073 2.607-0.472 1.309-0.208 2.864 0.749 4.385 1.543 2.457 4.102 4.298 7.025 4.966 1.536 0.352 2.977 0.155 4.162-0.569 0.992-0.606 1.666-1.503 1.996-2.502 0.223-0.677 0.045-1.242-0.403-1.547L16.94 12.62z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
