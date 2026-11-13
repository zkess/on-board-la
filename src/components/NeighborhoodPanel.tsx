import { getRouteApi } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Shuffle } from "lucide-react";
import { APPS } from "@/lib/la-data";
import { factsQuery, pickFacts } from "@/lib/facts";
import { CITY_DEPARTMENTS, CITYWIDE, hyperlocalFor } from "@/lib/newsletters";
import { subredditsFor } from "@/lib/subreddits";
import { SanitationDetails } from "@/components/SanitationDetails";

const parent = getRouteApi("/explore");
export type Id = "trash" | "reps" | "history" | "press" | "city" | "apps";

export const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">{children}<ExternalLink className="h-3 w-3" /></a>
);

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
    </ul>
    <SanitationDetails />
    </>);
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
  if (id === "press") {
    const local = hyperlocalFor(d.nc?.name ?? "", region);
    const communities = subredditsFor(d.nc?.name ?? "");
    return <>
      {local.length ? list(local) : <p className="text-sm text-muted-foreground">No hyperlocal newsletter here yet.</p>}
      {communities.length > 0 && <>
        <h3 className="mb-2 mt-4 text-xs font-semibold text-secondary">Neighborhood Reddit</h3>
        {list(communities.map((community) => ({ ...community, about: `${community.about} · Community discussion` })))}
        <p className="mt-2 text-xs text-muted-foreground">Resident-run communities, not official news sources.</p>
      </>}
      {!localOnly && <><p className="mb-2 mt-4 text-xs font-semibold text-secondary">Citywide independent</p>{list(CITYWIDE)}</>}
    </>;
  }
  if (id === "city") return list(CITY_DEPARTMENTS);
  return list(APPS.map((a) => ({ name: a.name, url: a.url, about: a.what })));
}
