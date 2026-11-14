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
/** Drops the leading house number so we can find the street itself. */
export function streetOnlyQuery(query: string): string | undefined {
  const n = requestedHouseNumber(query);
  return n ? query.trim().slice(n.length).trim() : undefined;
}

/** For a numbered query with no exact house match, the best street-level hit (approximate). */
export function selectStreetFallback(hits: GeocodingHit[]): GeocodingHit | undefined {
  return hits.find((hit) => hit.address?.["road"] && !hit.address?.["house_number"]);
}
