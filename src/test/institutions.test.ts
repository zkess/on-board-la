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
  it("imports the Westside batch without duplicating Beyond Baroque", () => {
    const batch = INSTITUTIONS.filter((place) => place.sourceCredit?.startsWith("Supplied Westside"));
    expect(batch).toHaveLength(52);
    expect(INSTITUTIONS.filter((place) => /beyond baroque/i.test(place.name))).toHaveLength(1);
    expect(batch.every((place) => place.linkKind === "map" && place.lat === undefined && place.lng === undefined)).toBe(true);
    expect(institutionsFor("Bel-Air").map((place) => place.name)).toContain("Hotel Bel-Air Restaurant");
    expect(institutionsFor("Westwood").map((place) => place.name)).toContain("Holmby Park");
    expect(institutionsFor("Sawtelle").map((place) => place.name)).toContain("GR2 Gallery (Giant Robot)");
  });
  it("does not substitute neighboring or citywide places", () => {
    expect(institutionsFor("Venice").map((p) => p.name)).toEqual(["Beyond Baroque", "Venice Beach Recreation Center", "Gjusta", "Venice Beach Boardwalk & Muscle Beach", "The Rose Venice"]);
    expect(institutionsFor("Central Hollywood")).toEqual([]);
    expect(institutionsFor(null)).toEqual([]);
  });
  it("imports the Valley batch without duplicating The Ford", () => {
    const batch = INSTITUTIONS.filter((place) => place.sourceCredit?.startsWith("Supplied San Fernando Valley"));
    expect(batch).toHaveLength(82);
    expect(INSTITUTIONS.filter((place) => /^The Ford(?: Amphitheatre)?$/.test(place.name))).toHaveLength(1);
    expect(batch.every((place) => place.linkKind === "map" && place.lat === undefined && place.lng === undefined)).toBe(true);
    expect(new Set(INSTITUTIONS.map((place) => place.id)).size).toBe(INSTITUTIONS.length);
    expect(institutionsFor("Arleta").map((place) => place.name)).toContain("Arleta Branch Library");
    expect(institutionsFor("Sylmar").map((place) => place.name)).toContain("Nethercutt Collection");
  });
  it("places combined Valley districts into their corresponding Mapping L.A. neighborhoods", () => {
    expect(institutionsFor("Tujunga").map((place) => place.name)).toEqual(expect.arrayContaining(["Bolton Hall Museum", "McGroarty Arts Center"]));
    expect(institutionsFor("Sunland").map((place) => place.name)).toContain("The Back Door Bakery & Cafe");
    expect(institutionsFor("Woodland Hills").map((place) => place.name)).toContain("Warner Center Park (Lou Bredlow Pavilion)");
    expect(institutionsFor("Griffith Park").map((place) => place.name)).toContain("Cahuenga Peak");
  });
});