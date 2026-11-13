/** Collapse a GeoHub service region (e.g. "SOUTH EAST VALLEY") to one area key. Valley/Harbor win over compass words. */
export function regionKey(region: string): string {
  const r = region.toUpperCase();
  for (const k of ["VALLEY", "HARBOR", "SOUTH", "WEST", "EAST", "CENTRAL"]) if (r.includes(k)) return k;
  return "";
}
