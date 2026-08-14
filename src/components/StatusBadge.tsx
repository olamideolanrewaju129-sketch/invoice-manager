import type { InvoiceStatus } from "@/lib/types";

const statusClasses: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-700/30",
  unpaid: "bg-amber-100 text-amber-900 ring-1 ring-amber-700/30",
  overdue: "bg-red-100 text-red-900 ring-1 ring-red-700/30",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
