import { describe, expect, it, beforeEach } from "vitest";

import { summarizeInvoices } from "./storage";
import type { Invoice } from "./types";

const invoices: Invoice[] = [
  {
    id: "i1",
    clientId: "c1",
    amount: 500,
    description: "Paid invoice",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    status: "paid",
  },
  {
    id: "i2",
    clientId: "c2",
    amount: 300,
    description: "Unpaid invoice",
    issueDate: "2026-07-05",
    dueDate: "2026-07-20",
    status: "unpaid",
  },
  {
    id: "i3",
    clientId: "c3",
    amount: 150,
    description: "Overdue invoice",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    status: "overdue",
  },
  {
    id: "i4",
    clientId: "c4",
    amount: 200,
    description: "Second overdue invoice",
    issueDate: "2026-06-03",
    dueDate: "2026-06-20",
    status: "overdue",
  },
];

describe("summarizeInvoices", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sums paid invoices as revenue and unpaid/overdue as outstanding", () => {
    const summary = summarizeInvoices(invoices);

    expect(summary.totalRevenue).toBe(500);
    expect(summary.outstanding).toBe(300 + 150 + 200);
  });

  it("counts overdue invoices correctly", () => {
    const summary = summarizeInvoices(invoices);

    expect(summary.overdueCount).toBe(2);
  });
});
