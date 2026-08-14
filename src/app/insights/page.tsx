"use client";

import { useEffect, useState } from "react";
import { getClientName, getInvoices } from "@/lib/storage";
import type { Invoice } from "@/lib/types";

type InsightResponse = {
  summary: string;
  trends: string[];
  slowestPayingClient: string | null;
  totalOverdueAmount: number;
  recommendations: string[];
};

type InsightPayload = {
  clientName: string;
  amount: number;
  status: string;
  dueDate: string;
  daysOverdue: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function calculateDaysOverdue(dueDate: string) {
  const due = new Date(dueDate);
  const today = new Date(new Date().toISOString().slice(0, 10));
  if (due >= today) {
    return 0;
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((today.getTime() - due.getTime()) / msPerDay);
}

function buildPayload(invoices: Invoice[]): InsightPayload[] {
  return invoices.map((invoice) => ({
    clientName: getClientName(invoice.clientId),
    amount: invoice.amount,
    status: invoice.status,
    dueDate: invoice.dueDate,
    daysOverdue: calculateDaysOverdue(invoice.dueDate),
  }));
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const invoices = getInvoices();
      const payload = buildPayload(invoices);
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? `Request failed with status ${response.status}`);
      }

      if (
        typeof data?.summary !== "string" ||
        !Array.isArray(data?.trends) ||
        (data.slowestPayingClient !== null && typeof data.slowestPayingClient !== "string") ||
        typeof data?.totalOverdueAmount !== "number" ||
        !Array.isArray(data?.recommendations)
      ) {
        throw new Error("Insights API returned malformed data.");
      }

      setInsights(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Insights</h1>
        <p className="mt-2 text-lg text-slate-600 max-w-2xl">
          Automatically analyze your invoices and payment behavior using Gemini.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Loading insights...</p>
          <p className="mt-2 text-sm text-slate-500">Fetching payment patterns based on your current invoices.</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-rose-900">Unable to load AI insights.</p>
          <p className="mt-2 text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={fetchInsights}
            className="mt-6 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : insights ? (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
              <p className="mt-4 text-slate-600">{insights.summary}</p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Trends</h2>
                  <p className="mt-1 text-sm text-slate-500">Key payment patterns detected in your invoices.</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {insights.trends.map((trend, index) => (
                  <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {trend}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Recommendations</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Slowest Paying Client</h2>
              <p className="mt-4 text-slate-600">{insights.slowestPayingClient ?? "No clear slow payer identified."}</p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Total Overdue Amount</h2>
                  <p className="mt-1 text-sm text-slate-500">Amount currently overdue across invoices.</p>
                </div>
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
                  {formatCurrency(insights.totalOverdueAmount)}
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No insights available.</p>
          <p className="mt-2 text-sm text-slate-500">Try creating invoices first and then reload this page.</p>
        </div>
      )}
    </div>
  );
}
