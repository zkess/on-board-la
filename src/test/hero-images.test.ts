import { describe, it, expect } from "vitest";
import { heroFor, landmarkHero } from "@/lib/hero-images";
describe("heroFor", () => {
  it("uses the neighborhood's own landmark", () => expect(heroFor("Los Feliz Neighborhood Council", "Region 7 - East").subject).toBe("Griffith Observatory"));
  it("falls back to the region", () => expect(heroFor("Reseda Neighborhood Council", "Region 3 - South West Valley").subject).toMatch(/Ventura/));
});
describe("landmarkHero", () => {
  it("uses each famous spot's own photo", () => {
    expect(landmarkHero("Olvera Street, Los Angeles")?.subject).toBe("Olvera Street");
    expect(landmarkHero("Union Station, 800 North Alameda Street, Los Angeles")?.subject).toBe("Union Station");
    expect(landmarkHero("Leimert Park Village, Los Angeles")?.subject).toBe("Leimert Plaza Park");
  });
  it("leaves ordinary addresses to the neighborhood photo", () => expect(landmarkHero("200 N Spring St")).toBeUndefined());
});
