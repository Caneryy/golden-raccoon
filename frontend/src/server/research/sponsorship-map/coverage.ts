export function coverageNotice(
  state: "complete" | "partial" | "unavailable",
  numSponsoring: number,
  numSponsored: number,
): string {
  if (state === "unavailable") {
    return "Sponsorship data is currently unavailable. Please try again later.";
  }

  if (state === "partial") {
    return "Partial coverage: some sponsored entries could not be read.";
  }

  if (numSponsoring === 0 && numSponsored === 0) {
    return "No sponsorships found for this account.";
  }

  return `Complete coverage: ${numSponsoring} entries sponsored, ${numSponsored} entries receiving sponsorship.`;
}
