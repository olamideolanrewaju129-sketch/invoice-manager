"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addInvoice, getClients } from "@/lib/storage";
import type { Client } from "@/lib/types";

const initialFormState = {
  clientId: "",
  amount: "",
  description: "",
  dueDate: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  useEffect(() => {
    setClients(getClients());
  }, []);

  const amountValue = Number(formData.amount || 0);
  const canSubmit = useMemo(
    () =>
      formData.clientId &&
      formData.description.trim().length > 0 &&
      !!formData.dueDate &&
      amountValue > 0,
    [formData, amountValue],
  );

  const handleChange = (field: keyof typeof initialFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setError("Please complete all fields before saving.");
      return;
    }

    addInvoice({
      clientId: formData.clientId,
      amount: amountValue,
      description: formData.description,
      dueDate: formData.dueDate,
    });

    router.push("/invoices");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Invoice</h1>
        <p className="mt-2 text-lg text-slate-600 max-w-2xl">
          Add a new invoice and assign it to a client. The invoice will be saved in your browser storage.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Client</span>
              <select
                id="invoice-client"
                name="invoice-client"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "invoice-form-error" : undefined}
                value={formData.clientId}
                onChange={(event) => handleChange("clientId", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} — {client.company}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Amount</span>
              <input
                id="invoice-amount"
                name="invoice-amount"
                type="number"
                min="0"
                step="0.01"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "invoice-form-error" : undefined}
                value={formData.amount}
                onChange={(event) => handleChange("amount", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0.00"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              id="invoice-description"
              name="invoice-description"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "invoice-form-error" : undefined}
              value={formData.description}
              onChange={(event) => handleChange("description", event.target.value)}
              className="h-28 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Describe the work or deliverable"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Due Date</span>
              <input
                id="invoice-due-date"
                name="invoice-due-date"
                type="date"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "invoice-form-error" : undefined}
                value={formData.dueDate}
                onChange={(event) => handleChange("dueDate", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <div className="flex items-end justify-between gap-4">
              <div className="text-sm text-slate-500">
                Estimated total: {formData.amount ? formatCurrency(amountValue) : "—"}
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Save Invoice
              </button>
            </div>
          </div>

          {error ? (
            <p id="invoice-form-error" aria-live="assertive" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
