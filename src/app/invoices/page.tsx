"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteInvoice, getClientName, getInvoices } from "@/lib/storage";
import { StatusBadge } from "@/components/StatusBadge";
import type { Invoice } from "@/lib/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setInvoices(getInvoices());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoices</h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl">
            This page displays all invoices with their client, amount, status, and due dates.
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
        >
          Create Invoice
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Client</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Due Date</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 text-sm text-slate-900">{getClientName(invoice.clientId)}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{invoice.description}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">{formatCurrency(invoice.amount)}</td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{invoice.dueDate}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => handleDelete(invoice.id)}
                    aria-label={`Delete invoice for ${getClientName(invoice.clientId)}`}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                  No invoices found. Create your first invoice to start tracking billing.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
