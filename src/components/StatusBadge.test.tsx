import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the paid label with the paid color classes", () => {
    render(<StatusBadge status="paid" />);

    const badge = screen.getByText("paid");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-emerald-100", "text-emerald-900");
  });

  it("renders the unpaid label with the unpaid color classes", () => {
    render(<StatusBadge status="unpaid" />);

    const badge = screen.getByText("unpaid");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-amber-100", "text-amber-900");
  });

  it("renders the overdue label with the overdue color classes", () => {
    render(<StatusBadge status="overdue" />);

    const badge = screen.getByText("overdue");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-100", "text-red-900");
  });
});
