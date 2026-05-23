import { describe, it, expect } from "vitest";
import { reportIssueUrl } from "./reportIssueLink";

describe("reportIssueUrl", () => {
  it("generates a GitHub new-issue URL with prefilled title/body", () => {
    const url = reportIssueUrl({
      repo: "maggie/italia-cammino",
      pageUrl: "/city/firenze/duomo",
      pageTitle: "Duomo",
    });
    expect(url).toContain("github.com/maggie/italia-cammino/issues/new");
    expect(url).toContain("title=");
    expect(url).toContain("Duomo");
    expect(decodeURIComponent(url)).toContain("/city/firenze/duomo");
  });
});
