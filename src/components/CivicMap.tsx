import { useEffect, useRef } from "react";
import L from "leaflet";
import { getBoundaries } from "@/lib/la.functions";
import { CIVIC_POIS } from "@/lib/la-data";

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export default function CivicMap({ lat, lng, district }: { lat: number; lng: number; district: number | null }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!el.current) return;
    const map = L.map(el.current).setView([lat, lng], 12);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
    }).addTo(map);
    const primary = css("--primary"), secondary = css("--secondary");
    const dot = (color: string, size: number) => L.divIcon({ className: "", html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
    L.marker([lat, lng], { icon: dot(primary, 22) }).addTo(map).bindPopup("You are here");
    CIVIC_POIS.forEach((p) => L.marker([p.lat, p.lng], { icon: dot(secondary, 14) }).addTo(map).bindPopup(`<b>${p.name}</b><br/>${p.kind}`));
    let alive = true;
    getBoundaries().then(({ council, nc }) => {
      if (!alive) return;
      const ncLayer = L.geoJSON(nc, { style: { color: secondary, weight: 1, dashArray: "4 4", fillOpacity: 0 }, onEachFeature: (f, l) => l.bindTooltip(String(f.properties?.NAME ?? "")) });
      const cdLayer = L.geoJSON(council, {
        style: (f) => ({ color: primary, weight: 2, fillColor: primary, fillOpacity: Number(f?.properties?.District) === district ? 0.18 : 0.03 }),
        onEachFeature: (f, l) => l.bindTooltip(`District ${f.properties?.District} · ${f.properties?.NAME}`),
      });
      cdLayer.addTo(map); ncLayer.addTo(map);
      L.control.layers(undefined, { "Council districts": cdLayer, "Neighborhood councils": ncLayer }).addTo(map);
    }).catch(console.error);
    return () => { alive = false; map.remove(); };
  }, [lat, lng, district]);
  return <div ref={el} className="h-[70vh] w-full" />;
}
