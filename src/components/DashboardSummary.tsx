"use client";

import { useEffect, useState } from "react";
import { getInvoices, summarizeInvoices } from "@/lib/storage";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function DashboardSummary() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    outstanding: 0,
    overdueCount: 0,
  });

  useEffect(() => {
    const invoices = getInvoices();
    setSummary(summarizeInvoices(invoices));
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Total Revenue
        </p>
        <p className="mt-5 text-3xl font-semibold text-slate-900">
          {formatCurrency(summary.totalRevenue)}
        </p>
        <p className="mt-2 text-sm text-slate-500">Received from paid invoices.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Outstanding
        </p>
        <p className="mt-5 text-3xl font-semibold text-slate-900">
          {formatCurrency(summary.outstanding)}
        </p>
        <p className="mt-2 text-sm text-slate-500">Total unpaid and overdue amount.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Overdue Count
        </p>
        <p className="mt-5 text-3xl font-semibold text-slate-900">
          {summary.overdueCount}
        </p>
        <p className="mt-2 text-sm text-slate-500">Invoices past their due date.</p>
      </div>
    </div>
  );
}
