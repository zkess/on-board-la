import { describe, expect, it } from "vitest";
import { INSTITUTIONS, institutionsFor } from "@/lib/institutions";
import { mappingLaNeighborhood } from "@/lib/mapping-la.server";

describe("Neighborhood institutions", () => {
  it("keeps every listed institution inside its Mapping L.A. neighborhood", () => {
    for (const place of INSTITUTIONS) {
      if (place.lat === undefined || place.lng === undefined) continue;
      expect(mappingLaNeighborhood(place.lng, place.lat), place.name).toBe(place.neighborhood);
    }
  });
  it("imports all 51 supplied anchors without duplicating Philippe", () => {
    expect(INSTITUTIONS.filter((place) => place.sourceCredit?.startsWith("Supplied Downtown")).length).toBe(50);
    expect(INSTITUTIONS.filter((place) => place.name.toLowerCase() === "philippe the original")).toHaveLength(1);
  });
  it("keeps smaller district labels under the corresponding Times neighborhood", () => {
    expect(institutionsFor("Downtown").find((place) => place.name === "Bavel")?.district).toBe("Arts District");
    expect(institutionsFor("Echo Park").find((place) => place.name === "Carroll Avenue Historic District")?.district).toBe("Angelino Heights");
    expect(institutionsFor("Mid-Wilshire").map((place) => place.name)).toContain("Republique");
  });
  it("imports the Hollywood & Mid-Wilshire batch without duplicating Griffith Observatory", () => {
    const batch = INSTITUTIONS.filter((place) => place.sourceCredit?.startsWith("Supplied Hollywood & Mid-Wilshire"));
    expect(batch).toHaveLength(29);
    expect(INSTITUTIONS.filter((place) => place.name === "Griffith Observatory")).toHaveLength(1);
    expect(institutionsFor("Griffith Park").map((place) => place.name)).toContain("Griffith Observatory");
    expect(batch.every((place) => place.linkKind === "map" && place.lat === undefined && place.lng === undefined)).toBe(true);
    expect(new Set(INSTITUTIONS.map((place) => place.id)).size).toBe(INSTITUTIONS.length);
  });
  it("matches Little Armenia and Thai Town institutions to East Hollywood", () => {
    const names = institutionsFor("East Hollywood").map((place) => place.name);
    expect(names).toEqual(expect.arrayContaining(["Barnsdall Art Park", "St. Garabed Armenian Apostolic Church", "Carousel Restaurant", "Thai Community Development Center", "Jitlada", "Sapp Coffee Shop"]));
    expect(institutionsFor("Hollywood").map((place) => place.name)).toContain("Musso & Frank Grill");
    expect(institutionsFor("Windsor Square").map((place) => place.name)).toContain("The Getty House");
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