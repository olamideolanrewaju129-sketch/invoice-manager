"use client";

import { useEffect, useMemo, useState } from "react";
import { getSettings, saveSettings, toggleTheme, type Settings } from "@/lib/settings";

const emptySettings: Settings = {
  theme: "light",
  businessName: "",
  primaryEmail: "",
  supportEmail: "",
  phone: "",
  profileBio: "",
  notificationsEnabled: true,
  brandColor: "#047857",
};

function inputClassName() {
  return "rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const themeLabel = useMemo(
    () => (settings.theme === "dark" ? "Dark Mode" : "Light Mode"),
    [settings.theme],
  );

  const handleChange = (field: keyof Settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveSettings(settings);
    setSaved(true);
  };

  const handleThemeToggle = () => {
    const nextTheme = toggleTheme();
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Configure business profile, notification preferences, and theme settings for a premium billing experience.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition duration-300 ease-out dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-950/20">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Business profile</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Business name</span>
                <input
                  className={inputClassName()}
                  value={settings.businessName}
                  onChange={(event) => handleChange("businessName", event.target.value)}
                  placeholder="Business name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Primary email</span>
                <input
                  className={inputClassName()}
                  value={settings.primaryEmail}
                  onChange={(event) => handleChange("primaryEmail", event.target.value)}
                  placeholder="hello@example.com"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Support email</span>
                <input
                  className={inputClassName()}
                  value={settings.supportEmail}
                  onChange={(event) => handleChange("supportEmail", event.target.value)}
                  placeholder="support@example.com"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</span>
                <input
                  className={inputClassName()}
                  value={settings.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  placeholder="(555) 123-4567"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Brand color</span>
                <input
                  className="h-12 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  type="color"
                  value={settings.brandColor}
                  onChange={(event) => handleChange("brandColor", event.target.value)}
                />
              </label>
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Brand accent</span>
                <div className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div
                    className="h-10 w-10 rounded-full"
                    style={{ backgroundColor: settings.brandColor }}
                  />
                  <p className="text-sm text-slate-700 dark:text-slate-200">This color appears in previews and UI accents.</p>
                </div>
              </div>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile bio</span>
              <textarea
                className={inputClassName()}
                rows={4}
                value={settings.profileBio}
                onChange={(event) => handleChange("profileBio", event.target.value)}
                placeholder="Describe your business and service style."
              />
            </label>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
            <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-primary/50 dark:border-slate-700 dark:bg-slate-950">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(event) => handleChange("notificationsEnabled", event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-primary accent-primary"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Enable email notifications for invoices and reminders</span>
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition duration-200 hover:bg-emerald-600"
            >
              Save settings
            </button>
            {saved ? (
              <p className="text-sm text-emerald-700">Settings saved to browser storage.</p>
            ) : null}
          </div>
        </form>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-6 shadow-lg shadow-slate-200/60 transition duration-300 ease-out dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">Theme</p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{themeLabel}</h2>
              </div>
              <button
                type="button"
                onClick={handleThemeToggle}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                Switch
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Toggle between light and dark mode to match your brand and workspace environment.
            </p>
          </div>

          <div className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-semibold text-white shadow-lg"
                style={{ backgroundColor: settings.brandColor }}
              >
                {settings.businessName ? settings.businessName.slice(0, 2).toUpperCase() : "VM"}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Company preview</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{settings.businessName || "Verdant Media Co."}</p>
              </div>
            </div>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{settings.primaryEmail || "hello@verdantmedia.com"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{settings.profileBio || "Run your billing and client operations with clarity, efficiency, and style."}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: settings.brandColor }} />
                Brand accent
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Active profile</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{settings.businessName || "Verdant Media Co."}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{settings.primaryEmail || "hello@verdantmedia.com"}</p>
            </div>
            <div className="space-y-1 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="font-semibold">Support</p>
              <p>{settings.supportEmail || "support@verdantmedia.com"}</p>
              <p>{settings.phone || "(555) 014-2789"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
