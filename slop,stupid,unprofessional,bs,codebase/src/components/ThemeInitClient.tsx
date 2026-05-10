"use client";

import { useEffect } from "react";

export default function ThemeInitClient() {
  useEffect(() => {
    // Temporarily hard-lock dark mode for consistent brand visuals.
    document.documentElement.dataset.theme = "dark";
    try {
      window.localStorage.setItem("velvet-theme", "dark");
    } catch {}
  }, []);

  return null;
}

