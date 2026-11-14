import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Trash2, Landmark, ScrollText, Newspaper, Smartphone, Building2, Radio } from "lucide-react";
import { Panel, A, type Id } from "@/components/NeighborhoodPanel";
import { APPS, RADIO } from "@/lib/la-data";
import { CITY_DEPARTMENTS, CITYWIDE } from "@/lib/newsletters";

const SECTIONS = [
  { id: "trash", label: "Streets and Sanitation", icon: Trash2 },
  { id: "reps", label: "Representatives", icon: Landmark },
  { id: "history", label: "History & Culture", icon: ScrollText },
  { id: "press", label: "Neighborhood News", icon: Newspaper },
] as const satisfies readonly { id: Id; label: string; icon: unknown }[];

export const Route = createFileRoute("/explore/")({
  head: () => ({ meta: [
    { title: "Neighborhood dashboard — ON BOARD LA" },
    { name: "description", content: "Your neighborhood representatives, streets and sanitation, news, history and citywide essentials." },
    { property: "og:title", content: "Neighborhood dashboard — ON BOARD LA" },
    { property: "og:description", content: "Your local civic information and citywide resources, all in one neighborhood dashboard." },
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
  const history = SECTIONS.find((x) => x.id === "history");
  if (!history) return null;
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {tiles.map((x) => (
          <section key={x.id} id={x.id} className={`civic-tile civic-tile-${x.id} border border-border p-6 shadow-soft`}>
            <h2 className="card-heading mb-4 flex items-start gap-3 font-bold text-foreground"><span className="civic-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"><x.icon className="h-5 w-5" /></span><span className="min-w-0 self-center">{x.label}</span></h2>
            <Panel id={x.id} localOnly />
          </section>
        ))}
      </div>
      <section id="history" className="history-showpiece relative mt-10 overflow-hidden rounded-[20px] bg-accent p-6 text-accent-foreground shadow-soft md:p-10">
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-0 font-display text-[120px] leading-none text-bloom">“</span>
        <h2 className="relative mb-5 flex items-center gap-2 font-display text-3xl font-bold text-foreground"><history.icon className="h-6 w-6 shrink-0" />{history.label}</h2>
        <Panel id="history" localOnly />
      </section>
      <Toolkit />
    </div>
  );
}

function Toolkit() {
  const cols = [
    { title: "Essential LA apps", icon: Smartphone, items: APPS.map((a) => ({ name: a.name, url: a.url, about: a.what })) },
    { title: "City news", icon: Building2, items: CITY_DEPARTMENTS },
    { title: "Citywide independent press", icon: Newspaper, items: CITYWIDE },
    { title: "Local news radio", icon: Radio, items: RADIO },
  ];
  return (
    <section id="toolkit" className="mt-14 border-t-2 border-border pt-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-sunset-text">For every Angeleno</p>
      <h2 className="mt-1 font-display text-3xl font-bold text-foreground">The citywide toolkit</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">The same essentials apply wherever you live in LA. Call 3-1-1 for any city service.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title} className="rounded-[20px] border border-border bg-muted p-6">
            <h3 className="card-heading mb-3 flex items-start gap-2 font-bold"><c.icon className="mt-1 h-5 w-5 shrink-0 text-primary" /><span className="min-w-0">{c.title}</span></h3>
            <ul className="resource-list">{c.items.map((n) => <li key={n.name}><A href={n.url}>{n.name}</A><span className="resource-description block">{n.about}</span></li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
