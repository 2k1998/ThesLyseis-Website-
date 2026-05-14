"use client";
import { useEffect } from "react";
import { initAttribution } from "@/lib/attribution";
import initAnalytics from "@/lib/analytics";
import { initScrollTracking, trackEvent } from "@/lib/events";

export default function AnalyticsInit() {
  useEffect(() => {
    initAnalytics();
    initAttribution();
    trackEvent("page_view");
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);
  return null;
}
