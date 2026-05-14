"use client";

import { useRef, useState } from "react";
import Container from "./Container";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/events";

export default function Hero() {
  const [formData, setFormData] = useState({ name: "", phone: "", company_name: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formStartTrackedRef = useRef(false);

  const handleFormFieldFocus = () => {
    if (formStartTrackedRef.current) return;
    trackEvent("form_start", { lead_channel: "mini_form" });
    formStartTrackedRef.current = true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const attribution = getAttribution();
      const scrollMax = document.body.scrollHeight - window.innerHeight;
      const scrollDepthAtSubmit =
        scrollMax > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / scrollMax) * 100)))
          : 0;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "mini",
          attribution,
          device_type: window.innerWidth < 768 ? "mobile" : "desktop",
          scroll_depth_at_submit: scrollDepthAtSubmit,
          time_to_submit_seconds: Math.round(performance.now() / 1000),
          lead_channel: "mini_form",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Αποτυχία κατά την αποστολή. Προσπαθήστε ξανά.");
      }

      window.dispatchEvent(new CustomEvent("form_success"));
      window.dispatchEvent(new Event("theslyseis:submitted"));
      trackEvent("mini_submit_success");
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
      setFormData({ name: "", phone: "", company_name: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage((err as Error).message || "Προέκυψε σφάλμα.");
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Subtle radial gradient background accent */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(87,39,163,0.15),_transparent_60%)] opacity-70 dark:opacity-40"></div>
      
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center mx-auto max-w-[800px]">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            Ο προσωπικός σας σύμβουλος ενέργειας.
          </h1>
          <div className="mb-10 max-w-2xl space-y-3">
            <p className="text-lg md:text-xl font-bold text-black dark:text-white">
              Δεν ήξερες; Δε ρώταγες. Η απάντηση είναι μία:{" "}
              <span className="font-bold text-[#5727A3]">Θες Λύσεις</span>.
            </p>
            <p className="text-lg md:text-xl text-neutral-gray">
              Παρακολουθούμε την αγορά για εσάς και σας ενημερώνουμε ποιο πρόγραμμα και ποιος πάροχος συμφέρει με βάση την κατανάλωσή σας. Χωρίς κόστος, χωρίς δεσμεύσεις.
            </p>
          </div>

          {/* Mini Form (Wired) */}
          <div id="mini-form" className="w-full max-w-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none min-h-[100px] flex items-center justify-center">
            {status === "success" ? (
              <div className="text-primary font-medium flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Το αίτημά σας καταχωρήθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Honeypot field (hidden from screen readers & visual) */}
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="absolute opacity-0 -z-50 w-0 h-0 p-0 m-0"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                  />

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Όνομα *"
                      required
                      disabled={status === "loading"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-black/5 dark:bg-black/50 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 md:py-4 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                      aria-label="Όνομα"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      placeholder="Τηλέφωνο *"
                      required
                      disabled={status === "loading"}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-black/5 dark:bg-black/50 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 md:py-4 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                      aria-label="Τηλέφωνο"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-primary hover:bg-primary-light text-white font-medium rounded-xl px-8 py-3 md:py-4 hover:scale-[1.02] transition-all duration-300 w-full md:w-auto flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center min-w-[180px]"
                  >
                    {status === "loading" ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      "Θέλω έλεγχο του λογαριασμού μου"
                    )}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
