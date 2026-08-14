"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/invoices", label: "Invoices" },
  { href: "/invoices/new", label: "Create Invoice" },
  { href: "/clients", label: "Clients" },
  { href: "/insights", label: "AI Insights" },
  { href: "/settings", label: "Settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sidebar navigation" className="mt-4 flex flex-col gap-1.5">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none",
              isActive
                ? "bg-primary/10 text-primary dark:bg-slate-800 dark:text-emerald-300"
                : "text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-900",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SecondarySidebarNav() {
  return (
    <nav aria-label="System links" className="flex flex-col gap-1.5">
      <Link
        href="/health"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-900"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Health Check
      </Link>
    </nav>
  );
}
