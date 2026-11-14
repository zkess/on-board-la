import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Trash2, Landmark, ScrollText, Newspaper, Smartphone, Building2, Radio, Phone, TrainFront } from "lucide-react";
import { Panel, A, type Id } from "@/components/NeighborhoodPanel";
import { APPS, RADIO } from "@/lib/la-data";
import { CITY_DEPARTMENTS, CITYWIDE } from "@/lib/newsletters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    { id: "apps", title: "Apps", icon: Smartphone, items: APPS.map((a) => ({ name: a.name, url: a.url, about: a.what })) },
    { id: "city", title: "City news", icon: Building2, items: CITY_DEPARTMENTS },
    { id: "press", title: "Independent press", icon: Newspaper, items: CITYWIDE },
    { id: "radio", title: "Local radio", icon: Radio, items: RADIO },
  ];
  const featured = [
    { name: "MyLA311", icon: Smartphone, chip: "bg-accent text-accent-foreground", about: "Report issues & pickups" },
    { name: "211 LA", icon: Phone, chip: "bg-primary text-primary-foreground", about: "Food & housing referrals" },
    { name: "Metro TAP", icon: TrainFront, chip: "bg-bloom/15 text-sunset-text", about: "Load fare for bus & rail" },
  ];
  return (
    <section id="toolkit" className="mt-14 border-t-2 border-border pt-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-sunset-text">For every Angeleno</p>
      <h2 className="mt-1 font-display text-3xl font-bold text-foreground">The citywide toolkit</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">The same essentials apply wherever you live in LA. Call 3-1-1 for any city service.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {featured.map((f) => {
          const app = APPS.find((a) => a.name === f.name);
          if (!app) return null;
          return <div key={f.name} className="rounded-[20px] border border-border bg-tile-light p-5 shadow-soft">
            <span className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full ${f.chip}`}><f.icon className="h-5 w-5" /></span>
            <div><A href={app.url}>{f.name}</A></div>
            <p className="resource-description mt-1">{f.about}</p>
          </div>;
        })}
      </div>
      <Tabs defaultValue="apps" className="mt-6 rounded-[20px] border border-border bg-tile-light p-5 md:p-6">
        <TabsList aria-label="Citywide resources" className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-4">
          {cols.map((c) => <TabsTrigger key={c.id} value={c.id} className="min-h-11 gap-2 whitespace-normal px-3 py-2 text-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground focus-visible:ring-[3px]"><c.icon className="h-4 w-4 shrink-0" />{c.title}</TabsTrigger>)}
        </TabsList>
        {cols.map((c) => <TabsContent key={c.id} value={c.id} className="mt-6">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-[14px] md:grid-cols-2">
            {c.items.map((n) => <li key={n.name}><A href={n.url}>{n.name}</A><span className="resource-description block">{n.about}</span></li>)}
          </ul>
        </TabsContent>)}
      </Tabs>
    </section>
  );
}
