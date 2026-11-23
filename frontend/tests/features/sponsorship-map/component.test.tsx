import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SponsorshipMap } from "@/components/research/sponsorship-map/SponsorshipMap";

describe("SponsorshipMap", () => {
  it("renders initial form", () => {
    render(<SponsorshipMap />);
    expect(screen.getByLabelText("Account")).toBeDefined();
    expect(screen.getByRole("button", { name: /map/i })).toBeDefined();
  });

  it("displays idle message", () => {
    render(<SponsorshipMap />);
    expect(screen.getByTestId("sponsorship-map-idle")).toBeDefined();
  });

  it("renders with testnet by default", () => {
    render(<SponsorshipMap />);
    const networkSelect = screen.getByLabelText("Network") as HTMLSelectElement;
    expect(networkSelect.value).toBe("stellar-testnet");
  });

  it("renders with pubnet when specified", () => {
    render(<SponsorshipMap initialNetwork="stellar-pubnet" />);
    const networkSelect = screen.getByLabelText("Network") as HTMLSelectElement;
    expect(networkSelect.value).toBe("stellar-pubnet");
  });
});
