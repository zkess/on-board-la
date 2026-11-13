import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import type { FeatureCollection, MultiPolygon } from "geojson";
import boundaries from "@/data/mapping-la-neighborhoods.json";

type Properties = { name: string; metadata: { city: string } };
const neighborhoods = boundaries as FeatureCollection<MultiPolygon, Properties>;

/** Original Times V6 boundaries; no geocoder labels or council-name inference. */
export function mappingLaNeighborhood(lng: number, lat: number): string | null {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const match = neighborhoods.features.find((feature) =>
    feature.properties.metadata.city === "los-angeles" &&
    booleanPointInPolygon([lng, lat], feature),
  );
  return match?.properties.name ?? null;
}