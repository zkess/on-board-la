import { describe, expect, it } from "vitest";
import { INSTITUTIONS, institutionsFor } from "@/lib/institutions";
import { mappingLaNeighborhood } from "@/lib/mapping-la.server";

describe("Neighborhood institutions", () => {
  it("keeps every listed institution inside its Mapping L.A. neighborhood", () => {
    for (const place of INSTITUTIONS) {
      expect(mappingLaNeighborhood(place.lng, place.lat), place.name).toBe(place.neighborhood);
    }
  });
  it("shows Griffith Park institutions for the observatory neighborhood", () => {
    expect(institutionsFor("Griffith Park").map((p) => p.name)).toContain("Griffith Observatory");
    expect(institutionsFor("Griffith Park").map((p) => p.category)).toEqual(expect.arrayContaining(["Parks", "Buildings", "Cultural centers"]));
    expect(institutionsFor("Los Feliz").map((p) => p.name)).toContain("The Trails Café");
  });
  it("does not substitute neighboring or citywide places", () => {
    expect(institutionsFor("Venice").map((p) => p.name)).toEqual(["Beyond Baroque", "Venice Beach Recreation Center", "Gjusta"]);
    expect(institutionsFor("Central Hollywood")).toEqual([]);
    expect(institutionsFor(null)).toEqual([]);
  });
});