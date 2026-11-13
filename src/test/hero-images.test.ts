import { describe, it, expect } from "vitest";
import { heroFor } from "@/lib/hero-images";
describe("heroFor", () => {
  it("uses the neighborhood's own landmark", () => expect(heroFor("Los Feliz Neighborhood Council", "Region 7 - East").subject).toBe("Griffith Observatory"));
  it("falls back to the region", () => expect(heroFor("Reseda Neighborhood Council", "Region 3 - South West Valley").subject).toMatch(/Ventura/));
});
