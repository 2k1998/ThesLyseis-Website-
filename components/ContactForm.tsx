"use client";

import { useRef, useState } from "react";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/events";
import Container from "./Container";

type ContactFormProps = {
  /** When true, renders only the form card for use inside a parent layout (no section/Container/heading). */
  embedded?: boolean;
};

export default function ContactForm({ embedded = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "", // Will be "Ιδιώτης" or "Επιχείρηση" via select
    provider: "",
    monthly_bill: "",
    referral: "",
    message: "",
    company_name: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formStartTrackedRef = useRef(false);

  const handleFormFieldFocus = () => {
    if (formStartTrackedRef.current) return;
    trackEvent("form_start", { lead_channel: "full_form" });
    formStartTrackedRef.current = true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.type) {
      setStatus("error");
      setErrorMessage("Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία.");
      return;
    }

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
          source: "full",
          attribution,
          device_type: window.innerWidth < 768 ? "mobile" : "desktop",
          scroll_depth_at_submit: scrollDepthAtSubmit,
          time_to_submit_seconds: Math.round(performance.now() / 1000),
          lead_channel: "full_form",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
      }

      window.dispatchEvent(new CustomEvent("form_success"));
      window.dispatchEvent(new Event("theslyseis:submitted"));
      trackEvent("full_submit_success");
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
      setFormData({
        name: "", phone: "", email: "", type: "", provider: "", monthly_bill: "", referral: "", message: "", company_name: ""
      });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage((err as Error).message || "Προέκυψε σφάλμα επικοινωνίας.");
    }
  };

  const formCard = (
    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-10 shadow-sm">
      {status === "success" ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Το μήνυμά σας εστάλη!</h3>
          <p className="text-neutral-gray">
            Ευχαριστούμε για την επικοινωνία. Ένας σύμβουλός μας θα μελετήσει τα στοιχεία σας και θα επικοινωνήσει άμεσα μαζί σας.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-8 text-primary hover:text-primary-light font-medium transition-colors"
          >
            Νέα καταχώρηση
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="absolute opacity-0 -z-50 w-0 h-0 p-0 m-0"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black dark:text-white mb-2">Ονοματεπώνυμο *</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      disabled={status === "loading"}
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black dark:text-white mb-2">Τηλέφωνο Επικοινωνίας *</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      disabled={status === "loading"}
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white mb-2">Email *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      disabled={status === "loading"}
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-black dark:text-white mb-2">Τύπος *</label>
                    <select
                      id="type"
                      name="type"
                      required
                      disabled={status === "loading"}
                      value={formData.type}
                      onChange={handleChange}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    >
                      <option value="" disabled>Επιλέξτε...</option>
                      <option value="Ιδιώτης">Ιδιώτης</option>
                      <option value="Επιχείρηση">Επιχείρηση</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-black dark:text-white mb-2">Τωρινός Πάροχος (Προαιρετικό)</label>
                    <input
                      id="provider"
                      type="text"
                      name="provider"
                      disabled={status === "loading"}
                      value={formData.provider}
                      onChange={handleChange}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="monthly_bill" className="block text-sm font-medium text-black dark:text-white mb-2">Μέσο Μηνιαίο Κόστος (Προαιρετικό)</label>
                    <input
                      id="monthly_bill"
                      type="text"
                      name="monthly_bill"
                      disabled={status === "loading"}
                      value={formData.monthly_bill}
                      onChange={handleChange}
                      onFocus={handleFormFieldFocus}
                      className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black dark:text-white mb-2">Μήνυμα (Προαιρετικό)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    disabled={status === "loading"}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={handleFormFieldFocus}
                    className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 resize-y"
                  ></textarea>
                </div>

                {status === "error" && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{errorMessage}</p>
                  </div>
                )}

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-primary hover:bg-primary-light text-white font-medium rounded-xl px-10 py-4 text-lg hover:scale-[1.02] transition-all duration-300 w-full md:w-auto shadow-lg shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center min-w-[200px] mx-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {status === "loading" ? (
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      "Αποστολή Αιτήματος"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
  );

  if (embedded) {
    return <div className="w-full">{formCard}</div>;
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black w-full">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4">
              Επικοινωνήστε μαζί μας
            </h1>
            <p className="text-lg text-neutral-gray">
              Συμπληρώστε τα στοιχεία σας παρακάτω για μια ολοκληρωμένη πρόταση εξοικονόμησης.
            </p>
          </div>

          {formCard}
        </div>
      </Container>
    </section>
  );
}
