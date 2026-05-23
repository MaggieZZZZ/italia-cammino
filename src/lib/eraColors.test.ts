import { describe, it, expect } from "vitest";
import { eraColor, eraColorFaded } from "./eraColors";

describe("eraColor", () => {
  it("returns the hex for a known era", () => {
    expect(eraColor("renaissance")).toBe("#c9a961");
    expect(eraColor("ancient_rome")).toBe("#b8543d");
  });
  it("returns the contemporary gray for unknown era as fallback", () => {
    expect(eraColor("xyz" as any)).toBe("#888888");
  });
});

describe("eraColorFaded", () => {
  it("returns rgba with given alpha", () => {
    expect(eraColorFaded("renaissance", 0.3)).toBe("rgba(201,169,97,0.3)");
  });
});
