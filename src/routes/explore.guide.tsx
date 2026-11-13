import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Trash2, Landmark, ScrollText, Newspaper, Smartphone, Building2, Radio } from "lucide-react";
import { Panel, A, type Id } from "./explore.dial";
import { APPS, RADIO } from "@/lib/la-data";
import { CITY_DEPARTMENTS, CITYWIDE } from "@/lib/newsletters";

const SECTIONS = [
  { id: "trash", label: "Streets and Sanitation", icon: Trash2 },
  { id: "reps", label: "Representatives", icon: Landmark },
  { id: "history", label: "History & Culture", icon: ScrollText },
  { id: "press", label: "Neighborhood News", icon: Newspaper },
] as const satisfies readonly { id: Id; label: string; icon: unknown }[];

export const Route = createFileRoute("/explore/guide")({
  head: () => ({ meta: [
    { title: "Neighborhood field guide — LA Onboarding" },
    { name: "description", content: "Step through your LA neighborhood one chapter at a time." },
    { property: "og:title", content: "Neighborhood field guide — LA Onboarding" },
    { property: "og:description", content: "A chapter-by-chapter civic guide for your Los Angeles address." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Guide,
});
const parent = getRouteApi("/explore");

function Guide() {
  const d = parent.useLoaderData();
  if (d.status !== "ok") return null;
  const tiles = SECTIONS.filter((x) => x.id !== "history");
  const history = SECTIONS.find((x) => x.id === "history")!;
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {tiles.map((x) => (
          <section key={x.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold"><x.icon className="h-5 w-5 text-primary" />{x.label}</h2>
            <Panel id={x.id} localOnly />
          </section>
        ))}
      </div>
      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        <h2 className="mb-5 flex items-center gap-2 font-display text-3xl font-bold"><history.icon className="h-6 w-6 text-primary" />{history.label}</h2>
        <Panel id="history" localOnly />
      </section>
      <Toolkit />
    </div>
  );
}

function Toolkit() {
  const cols = [
    { title: "Essential LA apps", icon: Smartphone, items: APPS.map((a) => ({ name: a.name, url: a.url, about: a.what })) },
    { title: "City department news", icon: Building2, items: CITY_DEPARTMENTS },
    { title: "Citywide independent press", icon: Newspaper, items: CITYWIDE },
    { title: "Local news radio", icon: Radio, items: RADIO },
  ];
  return (
    <section className="mt-14 border-t border-border pt-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">For every Angeleno</p>
      <h2 className="mt-1 font-display text-3xl font-bold">The citywide toolkit</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">The same essentials apply wherever you live in LA. Call 3-1-1 for any city service.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title} className="rounded-3xl border border-border bg-muted/40 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><c.icon className="h-4 w-4 text-primary" />{c.title}</h3>
            <ul className="space-y-2 text-sm">{c.items.map((n) => <li key={n.name}><A href={n.url}>{n.name}</A><span className="block text-xs text-muted-foreground">{n.about}</span></li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
