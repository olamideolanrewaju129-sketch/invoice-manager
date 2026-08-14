"use client";

import { useEffect } from "react";
import { getTheme, setTheme } from "@/lib/settings";

export default function ThemeProvider() {
  useEffect(() => {
    const initialTheme = getTheme();
    setTheme(initialTheme);
  }, []);

  return null;
}
