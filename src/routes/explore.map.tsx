import { ClientOnly, createFileRoute, getRouteApi } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { CIVIC_POIS } from "@/lib/la-data";

export const Route = createFileRoute("/explore/map")({ component: MapPage });
const parent = getRouteApi("/explore");
const CivicMap = lazy(() => import("@/components/CivicMap"));

function dist(a: number, b: number, c: number, d: number) {
  const k = Math.PI / 180, x = (d - b) * k * Math.cos(((a + c) / 2) * k), y = (c - a) * k;
  return Math.sqrt(x * x + y * y) * 3959;
}

function MapPage() {
  const d = parent.useLoaderData();
  if (d.status !== "ok") return null;
  const feed = [...CIVIC_POIS].map((p) => ({ ...p, mi: dist(d.lat, d.lng, p.lat, p.lng) })).sort((a, b) => a.mi - b.mi);
  const fallback = <div className="flex h-[70vh] items-center justify-center rounded-3xl bg-muted text-muted-foreground">Loading map…</div>;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-3xl border border-border">
        <ClientOnly fallback={fallback}><Suspense fallback={fallback}><CivicMap lat={d.lat} lng={d.lng} district={d.council?.district ?? null} /></Suspense></ClientOnly>
      </div>
      <aside className="space-y-3">
        <div className="rounded-3xl bg-secondary p-5 text-secondary-foreground">
          <p className="text-xs uppercase tracking-widest opacity-80">Your area</p>
          <p className="font-display text-xl font-bold">Council District {d.council?.district}</p>
          <p className="text-sm opacity-90">{d.nc?.name}</p>
          <p className="mt-2 text-xs opacity-80">Orange = council districts · Teal dashes = neighborhood councils</p>
        </div>
        <h2 className="pt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nearby civic spots</h2>
        <ul className="space-y-2">
          {feed.map((p) => (
            <li key={p.name} className="rounded-2xl border border-border bg-card p-3">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.kind} · {p.mi.toFixed(1)} mi</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
