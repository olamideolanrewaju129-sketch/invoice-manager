"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { addClient, deleteClient, getClients } from "@/lib/storage";
import type { Client } from "@/lib/types";

const emptyClient = {
  name: "",
  email: "",
  company: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState(emptyClient);
  const [isAdding, setIsAdding] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setClients(getClients());
  }, []);

  const canSave = useMemo(
    () => formData.name.trim() && formData.email.trim() && formData.company.trim(),
    [formData],
  );

  const handleChange = (field: keyof typeof emptyClient, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) {
      setFormError("Please complete all client fields before saving.");
      return;
    }

    addClient(formData);
    setClients(getClients());
    setFormData(emptyClient);
    setFormError("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    setClients(getClients());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl">
            Manage your client directory here. You will be able to view client details, contact information, and their invoice history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((value) => !value)}
          aria-label={isAdding ? "Cancel adding client" : "Add a new client"}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isAdding ? "Cancel" : "Add Client"}
        </button>
      </div>

      {isAdding ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">New client</h2>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-3" noValidate>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                id="client-name"
                name="client-name"
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "client-form-error" : undefined}
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Client name"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                id="client-email"
                name="client-email"
                type="email"
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "client-form-error" : undefined}
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="client@example.com"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Company</span>
              <input
                id="client-company"
                name="client-company"
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "client-form-error" : undefined}
                value={formData.company}
                onChange={(event) => handleChange("company", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Company name"
              />
            </label>
            {formError ? (
              <p id="client-form-error" aria-live="assertive" className="md:col-span-3 text-sm text-red-700">
                {formError}
              </p>
            ) : null}
            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={!canSave}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Save Client
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Company</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 text-sm text-slate-900">{client.name}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{client.company}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{client.email}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => handleDelete(client.id)}
                    aria-label={`Delete client ${client.name}`}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                  No clients yet. Add a client to get started.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
