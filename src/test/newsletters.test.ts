import { describe, it, expect } from "vitest";
import { hyperlocalFor } from "@/lib/newsletters";
const names = (nc: string, r: string) => hyperlocalFor(nc, r).map((n) => n.name);
describe("hyperlocalFor", () => {
  it("Valley gets NoHo Nick", () => expect(names("Mid-Town North Hollywood", "South Valley")).toContain("NoHo Nick"));
  it("Los Feliz gets Voice of Los Feliz", () => expect(names("Los Feliz", "East")).toContain("The Voice of Los Feliz"));
  it("Valley doesn't get Larchmont Buzz", () => expect(names("Van Nuys", "South Valley")).not.toContain("Larchmont Buzz"));
});
