"use client";

import { useEffect, useRef } from "react";
import { initAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/events";

export default function AttributionInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initAttribution();
      trackEvent("page_view", { path: window.location.pathname });
    }
  }, []);

  return null;
}
