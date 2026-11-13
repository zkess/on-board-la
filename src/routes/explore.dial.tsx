import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Landmark, ScrollText, Newspaper, Users, Smartphone, Search, ExternalLink, Shuffle, LayoutGrid } from "lucide-react";
import { APPS } from "@/lib/la-data";
import { factsQuery, pickFacts } from "@/lib/facts";
import { CITY_DEPARTMENTS, CITYWIDE, hyperlocalFor } from "@/lib/newsletters";

export const Route = createFileRoute("/explore/dial")({
  head: () => ({ meta: [
    { title: "Explore by topic — LA Onboarding" },
    { name: "description", content: "Click through your LA neighborhood one topic at a time." },
    { property: "og:title", content: "Explore by topic — LA Onboarding" },
    { property: "og:description", content: "A topic dial for your Los Angeles address." },
  ] }),
  component: Dial,
});
const parent = getRouteApi("/explore");

export const SECTIONS = [
  { id: "trash", label: "Trash & streets", icon: Trash2, keys: "trash sweeping sanitation bulky 311 recycling" },
  { id: "reps", label: "Representatives", icon: Landmark, keys: "council councilmember supervisor congress representative neighborhood council meeting" },
  { id: "history", label: "Local history", icon: ScrollText, keys: "history lore facts story past" },
  { id: "press", label: "Local press", icon: Newspaper, keys: "news newsletter press paper" },
  { id: "city", label: "City departments", icon: Users, keys: "city department mayor library housing planning" },
  { id: "apps", label: "Essential apps", icon: Smartphone, keys: "apps download metro tap notify myla311 phone" },
] as const;
export type Id = (typeof SECTIONS)[number]["id"];

export const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">{children}<ExternalLink className="h-3 w-3" /></a>
);

function Dial() {
  const d = parent.useLoaderData();
  const [active, setActive] = useState<Id | null>(null);
  const [q, setQ] = useState("");
  if (d.status !== "ok") return null;
  const docked = active !== null;
  const term = q.trim().toLowerCase();
  const matches = (s: (typeof SECTIONS)[number]) => !term || `${s.label} ${s.keys}`.toLowerCase().includes(term);
  const n = SECTIONS.length;

  return (
    <div>
      <form className="mx-auto mb-6 flex max-w-md items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft"
        onSubmit={(e) => { e.preventDefault(); const hit = SECTIONS.find(matches); if (hit) setActive(hit.id); }}>
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search a topic, e.g. "trash" or "council"' aria-label="Search topics"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        {docked && <button type="button" onClick={() => setActive(null)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><LayoutGrid className="h-3 w-3" />Reset</button>}
      </form>

      <div className={`flex flex-col gap-6 ${docked ? "md:flex-row" : ""}`}>
        {/* Ring */}
        <div role="tablist" aria-label="Topics"
          className={`relative mx-auto shrink-0 transition-all duration-500 ease-out ${docked ? "hidden h-[420px] w-[150px] md:mx-0 md:block" : "h-[340px] w-[340px] md:h-[420px] md:w-[420px]"}`}>
          {!docked && <div className="absolute inset-[18%] flex items-center justify-center rounded-full border border-dashed border-border bg-card/60 p-6 text-center">
            <div><p className="font-display text-lg font-bold">Trash day: <span className="text-primary">{d.trashDay ?? "—"}</span></p>
              <p className="mt-1 text-xs text-muted-foreground">{d.council ? `Council District ${d.council.district}` : ""}<br />Tap a topic to explore</p></div>
          </div>}
          {docked && <div className="absolute -left-[270px] top-0 h-[420px] w-[420px] rounded-full border border-border" />}
          {SECTIONS.map((s, i) => {
            // Full circle: evenly around; docked: right half arc from -75° to 75°.
            const ang = docked ? (-75 + (150 * i) / (n - 1)) * (Math.PI / 180) : (i / n) * 2 * Math.PI - Math.PI / 2;
            const r = docked ? 210 : 42; // px when docked, % when centered
            const style = docked
              ? { left: `${-60 + r * Math.cos(ang)}px`, top: `${210 + r * Math.sin(ang)}px` }
              : { left: `${50 + r * Math.cos(ang)}%`, top: `${50 + r * Math.sin(ang)}%` };
            const on = active === s.id, dim = !matches(s);
            const Icon = s.icon;
            return (
              <button key={s.id} role="tab" aria-selected={on} onClick={() => setActive(s.id)} style={style}
                className={`group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-all duration-500 ease-out ${dim ? "opacity-30" : ""}`}>
                <span className={`flex items-center justify-center rounded-full border shadow-soft transition ${docked ? "h-11 w-11" : "h-16 w-16"} ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary group-hover:border-primary"}`}>
                  <Icon className={docked ? "h-5 w-5" : "h-6 w-6"} />
                </span>
                <span className={`whitespace-nowrap text-xs font-medium ${docked ? "sr-only" : ""}`}>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile docked strip */}
        {docked && <div className="flex gap-2 overflow-x-auto md:hidden">
          {SECTIONS.map((s) => { const Icon = s.icon; return (
            <button key={s.id} onClick={() => setActive(s.id)} className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs ${active === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"} ${matches(s) ? "" : "opacity-30"}`}>
              <Icon className="h-3 w-3" />{s.label}</button>); })}
        </div>}

        {docked && <section key={active} className="min-w-0 flex-1 animate-in fade-in slide-in-from-right-4 rounded-3xl border border-border bg-card p-6 shadow-soft duration-500">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{SECTIONS.find((s) => s.id === active)?.label}</h2>
          <Panel id={active} />
        </section>}
      </div>
    </div>
  );
}

export function Panel({ id, localOnly = false }: { id: Id; localOnly?: boolean }) {
  const d = parent.useLoaderData();
  const { data: facts = [] } = useQuery(factsQuery);
  const [i, setI] = useState(0);
  if (d.status !== "ok") return null;
  const region = d.nc?.region ?? "";
  if (id === "trash") return (<>
    <p className="text-xs uppercase tracking-wider text-muted-foreground">Trash day</p><p className="font-display text-2xl font-bold text-primary">{d.trashDay ?? "—"}</p>
    <p className="mt-1 text-sm text-muted-foreground">Bins out by 6 a.m.&nbsp;</p>
    <ul className="mt-4 space-y-1 text-sm">
      <li>Street sweeping — <A href="https://ladotlivestreetsweeping.lacity.org">look up your route</A></li>
      <li>Free bulky item pickup — <A href="https://myla311.lacity.gov">request on MyLA311</A></li>
    </ul></>);
  if (id === "reps") {
    const Row = ({ label, children }: { label: string; children: ReactNode }) => (
      <li><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-0.5 font-medium">{children}</p></li>
    );
    return (<ul className="space-y-3 text-sm">
      {d.council && <Row label={`City Council · District ${d.council.district}`}><A href={d.council.url}>{d.council.member}</A></Row>}
      {d.supervisor && <Row label={`County Supervisor · District ${d.supervisor.district}`}><A href={d.supervisor.url}>{d.supervisor.name ?? "Board of Supervisors"}</A></Row>}
      {d.congress && <Row label={`U.S. Congress · CA-${d.congress.district}`}><A href={d.congress.url}>{d.congress.name ?? "Find yours"}</A></Row>}
      {d.nc && <Row label="Neighborhood Council">{d.nc.empowerla ? <A href={d.nc.empowerla}>{d.nc.name}</A> : d.nc.name}</Row>}
      <li className="text-xs text-muted-foreground">Constituent help: call <strong className="text-foreground">3-1-1</strong></li>
    </ul>);
  }
  if (id === "history") {
    const lore = pickFacts(facts, d.nc?.name ?? "", region, 100);
    const l = lore.length ? lore[i % lore.length] : null;
    if (!l) return <p>Loading local history…</p>;
    return (<>
      <blockquote className="font-display text-2xl leading-snug">“{l.fact}”</blockquote>
      <p className="mt-3 text-xs text-muted-foreground">Source: <a className="underline" href={l.source_url} target="_blank" rel="noreferrer">{l.source_title}</a>, {l.source_publisher}</p>
      {lore.length > 1 && <button onClick={() => setI(Math.floor(Math.random() * lore.length))} className="mt-4 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"><Shuffle className="h-3 w-3" />Another fact</button>}
    </>);
  }
  const list = (items: { name: string; url: string; about: string }[]) => <ul className="space-y-2 text-sm">{items.map((n) => <li key={n.name}><A href={n.url}>{n.name}</A><span className="block text-xs text-muted-foreground">{n.about}</span></li>)}</ul>;
  if (id === "press") { const local = hyperlocalFor(d.nc?.name ?? "", region); return <>{local.length ? list(local) : <p className="text-sm text-muted-foreground">No hyperlocal newsletter here yet.</p>}{!localOnly && <><p className="mb-2 mt-4 text-xs font-semibold text-secondary">Citywide independent</p>{list(CITYWIDE)}</>}</>; }
  if (id === "city") return list(CITY_DEPARTMENTS);
  return list(APPS.map((a) => ({ name: a.name, url: a.url, about: a.what })));
}
