export type InvoiceStatus = "paid" | "unpaid" | "overdue";

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
};

export type Invoice = {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
};
