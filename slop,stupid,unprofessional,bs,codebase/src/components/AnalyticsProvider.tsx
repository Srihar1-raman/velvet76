"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    VelvetAnalytics?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    window.VelvetAnalytics = {
      track(event, payload = {}) {
        window.dataLayer?.push({ event, ...payload });
      },
    };
  }, []);

  useEffect(() => {
    window.VelvetAnalytics?.track("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
