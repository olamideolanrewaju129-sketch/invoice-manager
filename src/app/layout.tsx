import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { SecondarySidebarNav, SidebarNav } from "@/components/SidebarNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Invoice & Billing Manager",
  description: "Manage your invoices and clients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col md:flex-row text-slate-900 selection:bg-primary/30 dark:text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider />
        <aside aria-label="Sidebar" className="w-full md:w-64 bg-white/80 dark:bg-slate-950/90 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 z-10 sticky top-0 md:h-screen">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <div className="text-xl font-bold text-primary">InvoicePro</div>
          </div>
          <SidebarNav />

          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">System</h2>
            <SecondarySidebarNav />
          </div>
        </aside>
        <main id="main-content" className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl w-full" tabIndex={0}>
          {children}
        </main>
      </body>
    </html>
  );
}
