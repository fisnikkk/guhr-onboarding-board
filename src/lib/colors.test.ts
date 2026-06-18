import { describe, expect, it } from "vitest";
import { contrast, getContrastText, luminance } from "./colors";
import { MANDATE_TYPES } from "./constants";

describe("luminance", () => {
  it("computes 0 for black and ~1 for white", () => {
    expect(luminance("#000000")).toBeCloseTo(0, 5);
    expect(luminance("#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("getContrastText", () => {
  it("returns dark text on the brand gold (the avatar regression)", () => {
    expect(getContrastText("#d0b578")).toBe("#1a1a1a");
  });
  it("returns white on the darker member colors", () => {
    for (const bg of ["#5b6165", "#2f7d52", "#3b6b86", "#876b2c", "#7d6a4e"]) {
      expect(getContrastText(bg)).toBe("#ffffff");
    }
  });
});

describe("mandate badge contrast", () => {
  it("every mandate badge clears WCAG AA (>= 4.5:1)", () => {
    for (const m of MANDATE_TYPES) {
      expect(contrast(m.fg, m.bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
