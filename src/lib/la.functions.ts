import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { HOUSE, SUPERVISORS, SUPERVISORS_URL } from "@/lib/reps";
import { addressLabel, matchesHouseNumber, selectGeocodingHit, selectStreetFallback, streetOnlyQuery, requestedHouseNumber, type GeocodingHit } from "@/lib/address-geocoding";

const HUB = "https://maps.lacity.org/lahub/rest/services/Boundaries/MapServer";
const COUNTY = "https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/Political_Boundaries/MapServer";
const UA = "LA-Onboarding/1.0 (civic newcomer guide)";

export type Lookup =
  | { status: "notfound"; query: string }
  | { status: "outside"; query: string; label: string; approximate?: boolean; city: string | null; lat: number; lng: number }
  | {
      status: "ok";
      query: string;
      label: string;
      /** True when the exact house number wasn't mapped and we used the street instead. */
      approximate?: boolean;
      lat: number;
      lng: number;
      neighborhood: string | null;
      council: { district: number; member: string; url: string } | null;
      nc: { name: string; website: string; empowerla: string; email: string; phone: string; region: string } | null;
      trashDay: string | null;
      sanitationDistrict: string | null;
      supervisor: { district: number; name: string | null; url: string } | null;
      congress: { district: number; name: string | null; url: string } | null;
    };

type Attrs = Partial<Record<"DISTRICT"|"DIST_CONG"|"CITY"|"District"|"NAME"|"WADDRESS"|"DWEBSITE"|"DEMAIL"|"DPHONE"|"SERVICE_RE"|"Day"|"District_Name", string | number>>;

async function hubPoint(layer: number, lng: number, lat: number, base = HUB) {
  const url = `${base}/${layer}/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
  const r = await fetch(url);
  if (!r.ok) return [] as Attrs[];
  const j = (await r.json()) as { features?: { attributes: Attrs }[] };
  return (j.features ?? []).map((f) => f.attributes);
}

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bNc\b/, "Neighborhood Council");

export const lookupAddress = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ q: z.string().trim().min(2).max(200) }).parse(d))
  .handler(async ({ data }): Promise<Lookup> => {
    const q = data.q;
    // Bias to LA County (viewbox) so short queries resolve locally.
    const search = async (text: string) => {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=us&viewbox=-118.95,34.82,-117.65,33.70&bounded=1&q=${encodeURIComponent(text)}`,
        { headers: { "User-Agent": UA, "Accept-Language": "en" } },
      );
      return r.ok ? ((await r.json()) as GeocodingHit[]) : [];
    };
    const hits = await search(q);
    let hit = selectGeocodingHit(q, hits);
    let approximate = false;
    if (!hit && requestedHouseNumber(q)) {
      // Exact building isn't in OpenStreetMap: fall back to the street, clearly flagged as approximate.
      hit = selectStreetFallback(hits);
      if (!hit) { const street = streetOnlyQuery(q); if (street && street.length >= 2) hit = selectStreetFallback(await search(street)); }
      approximate = !!hit;
    }
    if (!hit) return { status: "notfound", query: q };
    const lat = Number(hit.lat), lng = Number(hit.lon);
    const label = approximate ? q : addressLabel(hit);
    const [cityB, cd, ncs, trash, sup, cong] = await Promise.all([
      hubPoint(7, lng, lat), hubPoint(13, lng, lat), hubPoint(18, lng, lat), hubPoint(22, lng, lat),
      hubPoint(27, lng, lat, COUNTY), hubPoint(29, lng, lat, COUNTY),
    ]);
    const inCity = cityB.some((a) => a.CITY === "IN");
    if (!inCity) {
      const a = hit.address ?? {};
      return { status: "outside", query: q, label, approximate, city: a["city"] ?? a["town"] ?? a["village"] ?? a["hamlet"] ?? null, lat, lng };
    }
    const c = cd[0];
    const dn = hit.display_name.toUpperCase();
    const n = ncs.find((a) => dn.includes(String(a.NAME ?? "").replace(/ NC$/, ""))) ?? ncs[0];
    const t = trash[0];
    const { mappingLaNeighborhood } = await import("@/lib/mapping-la.server");
    return {
      status: "ok", query: q, label, approximate, lat, lng,
      neighborhood: mappingLaNeighborhood(lng, lat),
      council: c ? { district: Number(c.District), member: String(c.NAME), url: `https://cd${Number(c.District)}.lacity.gov/` } : null,
      nc: n ? {
        name: titleCase(String(n.NAME)), website: String(n.WADDRESS ?? ""), empowerla: String(n.DWEBSITE ?? ""),
        email: String(n.DEMAIL ?? ""), phone: String(n.DPHONE ?? ""), region: titleCase(String(n.SERVICE_RE ?? "")),
      } : null,
      trashDay: t ? titleCase(String(t.Day)) : null,
      sanitationDistrict: t ? String(t.District_Name) : null,
      supervisor: sup[0] ? (() => { const n = Number(sup[0].DISTRICT); return { district: n, name: SUPERVISORS[n] ?? null, url: SUPERVISORS_URL }; })() : null,
      congress: cong[0] ? (() => { const n = Number(cong[0].DIST_CONG); const h = HOUSE[n]; return { district: n, name: h?.name ?? null, url: h?.url ?? "https://www.house.gov/representatives/find-your-representative" }; })() : null,
    };
  });

export const getBoundaries = createServerFn({ method: "GET" }).handler(async () => {
  const get = async (layer: number, fields: string) => {
    const r = await fetch(`${HUB}/${layer}/query?where=1%3D1&outFields=${fields}&outSR=4326&f=geojson&maxAllowableOffset=0.0015`);
    if (!r.ok) throw new Error(`Boundary layer ${layer} failed [${r.status}]`);
    return (await r.json()) as GeoJSON.FeatureCollection;
  };
  const [council, nc] = await Promise.all([get(13, "District,NAME"), get(18, "NAME")]);
  return { council, nc };
});

export type Suggestion = { label: string; detail: string };

/** Type-ahead address suggestions within the LA area (Photon allows autocomplete; Nominatim's policy does not). */
export const suggestAddresses = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ q: z.string().trim().min(3).max(200) }).parse(d))
  .handler(async ({ data }): Promise<Suggestion[]> => {
    try {
      const r = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(data.q)}&limit=6&lang=en&bbox=-118.67,33.70,-118.15,34.34`,
        { headers: { "User-Agent": UA } },
      );
      if (!r.ok) return [];
      const j = (await r.json()) as { features?: { properties: Record<string, string | undefined> }[] };
      const seen = new Set<string>();
      const out: Suggestion[] = [];
      for (const { properties: p } of j.features ?? []) {
        // Photon may return the street when its index has no matching house.
        // Never offer that result as a replacement for a numbered address.
        if (!matchesHouseNumber(data.q, p["housenumber"])) continue;
        const street = [p["housenumber"], p["street"]].filter(Boolean).join(" ");
        const label = p["name"] && p["name"] !== street ? p["name"] : street || p["name"];
        if (!label) continue;
        const detail = [p["name"] && street && p["name"] !== street ? street : null, p["district"] ?? p["locality"], p["city"], p["postcode"]].filter(Boolean).join(", ");
        const key = `${label}|${detail}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ label, detail });
      }
      return out;
    } catch {
      return [];
    }
  });
