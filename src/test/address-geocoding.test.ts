import { describe, expect, it } from "vitest";
import { selectStreetFallback, streetOnlyQuery, addressLabel, matchesHouseNumber, selectGeocodingHit, type GeocodingHit } from "@/lib/address-geocoding";

const query = "24642 Rod Place, Los Angeles";
const street: GeocodingHit = {
  lat: "34.1795046", lon: "-118.6621728",
  display_name: "Rod Place, Los Angeles",
  address: { road: "Rod Place", city: "Los Angeles" },
};
const house: GeocodingHit = {
  lat: "34.1794226", lon: "-118.6622071",
  display_name: "24642, Rod Place, Woodland Hills-Warner Center Neighborhood Council District, Los Angeles",
  address: { house_number: "24642", road: "Rod Place", city: "Los Angeles", postcode: "91367" },
};

describe("Numbered address resolution", () => {
  it("does not offer a street-only suggestion for 24642 Rod Place", () => {
    expect(matchesHouseNumber(query, undefined)).toBe(false);
    expect(matchesHouseNumber(query, "24642")).toBe(true);
    expect(matchesHouseNumber(query, "24640")).toBe(false);
  });
  it("selects the house instead of the street centroid", () => {
    expect(selectGeocodingHit(query, [street, house])).toEqual(house);
  });
  it("does not silently resolve to a street when the house is missing", () => {
    expect(selectGeocodingHit(query, [street])).toBeUndefined();
  });
  it("retains the house number and street together in the address label", () => {
    expect(addressLabel(house)).toBe("24642 Rod Place, Los Angeles, 91367");
  });
  it("still allows street and landmark searches without a house number", () => {
    expect(selectGeocodingHit("Rod Place, Los Angeles", [street])).toEqual(street);
    expect(matchesHouseNumber("Griffith Observatory", undefined)).toBe(true);
  });
});
describe("Approximate street fallback", () => {
  it("strips the house number to search the street", () => {
    expect(streetOnlyQuery("13201 Bradley Ave, Sylmar")).toBe("Bradley Ave, Sylmar");
    expect(streetOnlyQuery("Bradley Ave")).toBeUndefined();
  });
  it("falls back to the street hit, never a different house", () => {
    expect(selectStreetFallback([house, street])).toEqual(street);
    expect(selectStreetFallback([house])).toBeUndefined();
  });
});
