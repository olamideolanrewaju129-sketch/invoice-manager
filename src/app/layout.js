import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row text-slate-900 selection:bg-primary/30">
        <aside className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 p-6 flex flex-col gap-6 z-10 sticky top-0 md:h-screen">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h1 className="text-xl font-bold text-primary">InvoicePro</h1>
          </div>
          <nav className="flex flex-col gap-1.5 mt-4">
            <Link href="/" className="px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-200 font-medium text-sm text-slate-600">Dashboard</Link>
            <Link href="/invoices" className="px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-200 font-medium text-sm text-slate-600">Invoices</Link>
            <Link href="/invoices/new" className="px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-200 font-medium text-sm text-slate-600">Create Invoice</Link>
            <Link href="/clients" className="px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-200 font-medium text-sm text-slate-600">Clients</Link>
            <Link href="/settings" className="px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-200 font-medium text-sm text-slate-600">Settings</Link>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-slate-200">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</h3>
            <nav className="flex flex-col gap-1.5">
              <Link href="/health" className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 font-medium text-sm text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Health Check
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
