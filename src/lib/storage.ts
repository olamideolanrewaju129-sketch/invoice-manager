import type { Client, Invoice, InvoiceStatus } from "@/lib/types";

const CLIENTS_KEY = "invoice-manager.clients";
const INVOICES_KEY = "invoice-manager.invoices";

const sampleClients: Client[] = [
  {
    id: "c1",
    name: "Avery Sinclair",
    email: "avery@verdantmedia.com",
    company: "Verdant Media",
  },
  {
    id: "c2",
    name: "Jordan Kim",
    email: "jordan@solara.io",
    company: "Solara Technologies",
  },
  {
    id: "c3",
    name: "Mina Patel",
    email: "mina@pulsefinder.co",
    company: "PulseFinder",
  },
  {
    id: "c4",
    name: "Noah Grant",
    email: "noah@dawnworks.com",
    company: "DawnWorks Studio",
  },
];

const sampleInvoices: Invoice[] = [
  {
    id: "i1",
    clientId: "c1",
    amount: 4250,
    description: "Website redesign and deployment",
    issueDate: "2026-07-04",
    dueDate: "2026-07-18",
    status: "paid",
  },
  {
    id: "i2",
    clientId: "c2",
    amount: 980,
    description: "Quarterly paid media report",
    issueDate: "2026-07-25",
    dueDate: "2026-08-08",
    status: "unpaid",
  },
  {
    id: "i3",
    clientId: "c3",
    amount: 1850,
    description: "Mobile app wireframes and UX review",
    issueDate: "2026-06-29",
    dueDate: "2026-07-13",
    status: "overdue",
  },
  {
    id: "i4",
    clientId: "c4",
    amount: 5400,
    description: "Brand refresh and launch package",
    issueDate: "2026-07-17",
    dueDate: "2026-08-03",
    status: "paid",
  },
  {
    id: "i5",
    clientId: "c1",
    amount: 1120,
    description: "Maintenance support for July",
    issueDate: "2026-07-30",
    dueDate: "2026-08-20",
    status: "unpaid",
  },
];

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseJson<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeClients(clients: Client[]) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

function writeInvoices(invoices: Invoice[]) {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

function ensureSeeded() {
  if (typeof window === "undefined") {
    return;
  }

  const rawClients = localStorage.getItem(CLIENTS_KEY);
  const rawInvoices = localStorage.getItem(INVOICES_KEY);

  if (!rawClients) {
    writeClients(sampleClients);
  }

  if (!rawInvoices) {
    writeInvoices(sampleInvoices);
  }
}

export function getClients(): Client[] {
  if (typeof window === "undefined") {
    return [];
  }

  ensureSeeded();
  return parseJson<Client[]>(localStorage.getItem(CLIENTS_KEY), []);
}

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") {
    return [];
  }

  ensureSeeded();
  return parseJson<Invoice[]>(localStorage.getItem(INVOICES_KEY), []);
}

export function addClient(client: Omit<Client, "id">): Client {
  const clients = getClients();
  const newClient: Client = { id: createId(), ...client };
  writeClients([...clients, newClient]);
  return newClient;
}

export function editClient(updatedClient: Client): Client {
  const clients = getClients();
  const nextClients = clients.map((client) =>
    client.id === updatedClient.id ? updatedClient : client,
  );
  writeClients(nextClients);
  return updatedClient;
}

export function deleteClient(clientId: string) {
  const clients = getClients().filter((client) => client.id !== clientId);
  writeClients(clients);
}

export function addInvoice(data: Omit<Invoice, "id" | "issueDate" | "status">): Invoice {
  const invoices = getInvoices();
  const issueDate = new Date().toISOString().slice(0, 10);
  const status = computeStatus(data.dueDate);
  const newInvoice: Invoice = {
    id: createId(),
    issueDate,
    status,
    ...data,
  };
  writeInvoices([...invoices, newInvoice]);
  return newInvoice;
}

export function editInvoice(updatedInvoice: Invoice): Invoice {
  const invoices = getInvoices();
  const nextInvoices = invoices.map((invoice) =>
    invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
  );
  writeInvoices(nextInvoices);
  return updatedInvoice;
}

export function deleteInvoice(invoiceId: string) {
  const invoices = getInvoices().filter((invoice) => invoice.id !== invoiceId);
  writeInvoices(invoices);
}

export function getClientName(clientId: string) {
  const client = getClients().find((item) => item.id === clientId);
  return client ? client.name : "Unknown client";
}

export function computeStatus(dueDate: string): InvoiceStatus {
  const due = new Date(dueDate);
  const now = new Date();
  const normalizedNow = new Date(now.toISOString().slice(0, 10));

  if (due < normalizedNow) {
    return "overdue";
  }

  return "unpaid";
}

export function summarizeInvoices(invoices: Invoice[]) {
  const summary = {
    totalRevenue: 0,
    outstanding: 0,
    overdueCount: 0,
  };

  invoices.forEach((invoice) => {
    if (invoice.status === "paid") {
      summary.totalRevenue += invoice.amount;
      return;
    }

    if (invoice.status === "overdue") {
      summary.overdueCount += 1;
    }

    if (invoice.status === "unpaid" || invoice.status === "overdue") {
      summary.outstanding += invoice.amount;
    }
  });

  return summary;
}
