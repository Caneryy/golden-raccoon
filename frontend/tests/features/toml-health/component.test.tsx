import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TomlHealthReport } from "@/components/research/toml-health/TomlHealthReport";

describe("TomlHealthReport", () => {
  it("renders domain input", () => {
    render(<TomlHealthReport />);
    expect(screen.getByLabelText("Home Domain")).toBeInTheDocument();
  });

  it("renders audit button", () => {
    render(<TomlHealthReport />);
    expect(screen.getByText("Audit stellar.toml")).toBeInTheDocument();
  });

  it("disables button when domain is empty", () => {
    render(<TomlHealthReport />);
    const button = screen.getByText("Audit stellar.toml");
    expect(button).toBeDisabled();
  });
});
