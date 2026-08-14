export type Settings = {
  theme: "light" | "dark";
  businessName: string;
  primaryEmail: string;
  supportEmail: string;
  phone: string;
  profileBio: string;
  notificationsEnabled: boolean;
  brandColor: string;
};

const SETTINGS_KEY = "invoice-manager.settings";

const defaultSettings: Settings = {
  theme: "light",
  businessName: "Verdant Media Co.",
  primaryEmail: "hello@verdantmedia.com",
  supportEmail: "support@verdantmedia.com",
  phone: "(555) 014-2789",
  profileBio: "Run your billing and client operations with clarity, efficiency, and style.",
  notificationsEnabled: true,
  brandColor: "#047857",
};

function parseJson<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function ensureSettings() {
  if (typeof window === "undefined") {
    return;
  }

  const rawSettings = localStorage.getItem(SETTINGS_KEY);
  if (!rawSettings) {
    writeSettings(defaultSettings);
  }
}

export function getSettings(): Settings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  ensureSettings();
  const savedSettings = parseJson<Partial<Settings>>(localStorage.getItem(SETTINGS_KEY), {});
  return { ...defaultSettings, ...savedSettings } as Settings;
}

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") {
    return;
  }

  writeSettings(settings);
}

export function getTheme(): Settings["theme"] {
  return getSettings().theme;
}

export function setTheme(theme: Settings["theme"]) {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  saveSettings({ ...getSettings(), theme });
}

export function toggleTheme() {
  const nextTheme = getTheme() === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  return nextTheme;
}
