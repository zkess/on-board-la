import { describe, it, expect, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { pickFacts, type Fact } from "@/lib/facts";

const f = (region: string, neighborhood: string | null, fact: string) => ({ region, neighborhood, fact } as Fact);
const all = [f("East", null, "e"), f("East", "Los Feliz", "lf"), f("East", "Boyle Heights", "bh"), f("Central", null, "c")];

describe("pickFacts", () => {
  it("puts the neighborhood's own fact first", () => {
    expect(pickFacts(all, "Los Feliz NC", "Region 4 - East").map((x) => x.fact)[0]).toBe("lf");
  });
  it("falls back to the citywide founding fact outside known regions", () => {
    expect(pickFacts(all, "X", "Nowhere").map((x) => x.fact)).toEqual(["c"]);
  });
});

describe("region tightening", () => {
  it("keeps South LA facts out of the South East Valley", () => {
    const pool = [f("South", null, "s"), f("Valley", "Studio City", "sc")];
    expect(pickFacts(pool, "Studio City NC", "SOUTH EAST VALLEY", 100).map((x) => x.fact)).toEqual(["sc"]);
  });
});
