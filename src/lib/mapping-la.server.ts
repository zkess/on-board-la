import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import type { FeatureCollection, MultiPolygon } from "geojson";
import boundaries from "@/data/mapping-la-neighborhoods.json";

type Properties = { name: string; metadata: { city: string; type: string } };
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
/** Area outside LA City: Times polygon name plus whether it is unincorporated county land. */
export function mappingLaArea(lng: number, lat: number): { name: string; unincorporated: boolean } | null {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const m = neighborhoods.features.find((f) => booleanPointInPolygon([lng, lat], f));
  return m ? { name: m.properties.name, unincorporated: m.properties.metadata.type === "unincorporated-area" } : null;
}
