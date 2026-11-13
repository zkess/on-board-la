import { describe, expect, it } from "vitest";
import { mappingLaNeighborhood } from "@/lib/mapping-la.server";

describe("Mapping L.A. header neighborhoods", () => {
  it("uses Mapping L.A. Downtown for Union Station rather than its council name", () => {
    expect(mappingLaNeighborhood(-118.2365, 34.0562)).toBe("Downtown");
  });
  it("identifies Venice Canals as Venice", () => {
    expect(mappingLaNeighborhood(-118.4685, 33.9849)).toBe("Venice");
  });
  it("identifies Studio City from the Times boundary", () => {
    expect(mappingLaNeighborhood(-118.387, 34.143)).toBe("Studio City");
  });
  it("does not label independent cities as Los Angeles neighborhoods", () => {
    expect(mappingLaNeighborhood(-118.4912, 34.0195)).toBeNull();
  });
});