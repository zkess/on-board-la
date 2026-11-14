export type GeocodingHit = {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
};

export function requestedHouseNumber(query: string): string | undefined {
  return query.trim().match(/^(\d+[a-z]?(?:-\d+[a-z]?)?)\s+/i)?.[1];
}

export function matchesHouseNumber(query: string, houseNumber: string | undefined): boolean {
  const requested = requestedHouseNumber(query);
  return !requested || requested.toLowerCase() === houseNumber?.trim().toLowerCase();
}

export function selectGeocodingHit(query: string, hits: GeocodingHit[]): GeocodingHit | undefined {
  return hits.find((hit) => matchesHouseNumber(query, hit.address?.["house_number"]));
}

export function addressLabel(hit: GeocodingHit): string {
  const address = hit.address;
  if (address?.["house_number"] && address["road"]) {
    return [
      `${address["house_number"]} ${address["road"]}`,
      address["city"] ?? address["town"] ?? address["village"],
      address["postcode"],
    ].filter(Boolean).join(", ");
  }
  return hit.display_name.split(", ").slice(0, 3).join(", ");
}