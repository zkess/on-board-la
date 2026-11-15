import { describe, expect, it } from "vitest";
import { checklistFor } from "@/lib/checklist";
import type { Lookup } from "@/lib/la.functions";

const local: Extract<Lookup, { status: "ok" }> = {
  status: "ok", query: "West Adams", label: "West Adams, Los Angeles", lat: 34.03, lng: -118.35,
  neighborhood: "West Adams", council: { district: 10, member: "Heather Hutt", url: "https://cd10.lacity.gov/" },
  nc: { name: "West Adams Neighborhood Council", empowerla: "https://empowerla.org/wanc/", website: "", email: "", phone: "", region: "South" },
  trashDay: "Wednesday", sanitationDistrict: null, supervisor: null, congress: null,
};
const tasks = (data: Lookup) => checklistFor(data).flatMap((phase) => phase.items);

describe("Address-aware checklist", () => {
  it("uses the selected councilmember and district with the office link", () => {
    expect(tasks(local).find((item) => item.id === "cd")).toMatchObject({ text: "Subscribe to Councilmember Heather Hutt's newsletter (CD 10)", link: "https://cd10.lacity.gov/" });
  });
  it("uses the EmpowerLA council rather than the Mapping LA neighborhood for meetings", () => {
    expect(tasks(local).find((item) => item.id === "nc")?.link).toBe("https://empowerla.org/wanc/");
  });
  it("uses matched local news resources", () => {
    if (!local.nc) throw new Error("Council fixture is missing");
    expect(tasks({ ...local, neighborhood: "Venice", nc: { ...local.nc, name: "Venice Neighborhood Council", region: "West" } }).find((item) => item.id === "news")?.resources).toContainEqual({ name: "r/venice", url: "https://www.reddit.com/r/venice/" });
  });
  it("keeps verified collection distinct from street sweeping and flags approximate lookup", () => {
    const tip = tasks({ ...local, approximate: true }).find((item) => item.id === "sweep")?.tip;
    expect(tip).toContain("Wednesday");
    expect(tip).toContain("Approximate");
    expect(tip).toContain("separate schedule");
  });
  it("does not invent a collection day when the city schedule is missing", () => {
    expect(tasks({ ...local, trashDay: "—" }).find((item) => item.id === "sweep")?.tip).not.toContain("collection is");
  });
  it("keeps regional essentials and excludes City of LA services for outside addresses", () => {
    const outside = tasks({ status: "outside", query: "Santa Monica", label: "Santa Monica", city: "Santa Monica", unincorporated: false, lat: 34.01, lng: -118.49 });
    expect(outside.map((item) => item.id)).toEqual(["myshake", "water", "vote", "tap", "news", "dmv", "car", "ready", "neighbor"]);
  });
  it("keeps all 18 generic tasks available without an address and preserves personalized IDs", () => {
    const generic = tasks({ status: "notfound", query: "" });
    expect(generic).toHaveLength(18);
    expect(tasks(local).map((item) => item.id)).toEqual(generic.map((item) => item.id));
    expect(generic.find((item) => item.id === "ladwp")?.cityOnly).toBe(true);
  });
});