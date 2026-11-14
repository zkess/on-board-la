import { describe, expect, it } from "vitest";
import { VENICE_COORDINATES, veniceSunset, sunsetLabel } from "@/lib/sunset";

describe("Venice sunset", () => {
  it("uses the requested Venice location", () => {
    expect(VENICE_COORDINATES).toEqual({ lat: 33.985, lng: -118.47 });
  });
  it("uses the Los Angeles day even after midnight UTC", () => {
    const sunset = veniceSunset(new Date("2026-11-14T00:07:00Z"));
    expect(sunset?.toISOString().slice(0, 10)).toBe("2026-11-14");
    expect(sunsetLabel(new Date("2026-11-14T00:07:00Z"))).toMatch(/^4:\d{2} PM$/);
  });
});