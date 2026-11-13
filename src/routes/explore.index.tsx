import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Landmark, Users, Newspaper, ScrollText, Smartphone, Trash2, ExternalLink, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { APPS } from "@/lib/la-data";
import { factsQuery, pickFacts } from "@/lib/facts";
import { CITY_DEPARTMENTS, CITYWIDE, hyperlocalFor, type Newsletter } from "@/lib/newsletters";

export const Route = createFileRoute("/explore/")({ component: Bento });
const parent = getRouteApi("/explore");

function Tile({ title, icon, className = "", children }: { title: string; icon: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`rounded-3xl border border-border bg-card p-6 shadow-soft ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{icon}{title}</h2>
      {children}
    </section>
  );
}
const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">{children}<ExternalLink className="h-3 w-3" /></a>
);

function Tier({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">{label}</p>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Bento() {
  const d = parent.useLoaderData();
  const { data: facts = [] } = useQuery(factsQuery);
  const [i, setI] = useState(0);
  if (d.status !== "ok") return null;
  const region = d.nc?.region ?? "";
  const lore = pickFacts(facts, d.nc?.name ?? "", region, 100);
  const local = hyperlocalFor(d.nc?.name ?? "", region);
  const initials = d.council?.member.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const l = lore.length ? lore[((i % lore.length) + lore.length) % lore.length] : null;
  const btn = "inline-flex items-center gap-1 rounded-full border border-current/30 px-3 py-1.5 text-xs font-medium transition hover:bg-card/20";
  return (
    <div className="space-y-10">
      <Tier label="Tier 1" title="Day 1 essentials">
        <div className="grid gap-4 md:grid-cols-2">
          <Tile title="Streets & sanitation" icon={<Trash2 className="h-4 w-4" />}>
            <p className="font-display text-5xl font-bold text-primary">{d.trashDay ?? "—"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Trash, recycling & green bins out by 6 a.m.{d.sanitationDistrict ? ` · ${d.sanitationDistrict} district` : ""}</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>Street sweeping varies block by block — <A href="https://ladotlivestreetsweeping.lacity.org">look up your route</A></li>
              <li>Bulky item pickup is free — <A href="https://myla311.lacity.gov">request on MyLA311</A></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="https://myla311.lacity.gov" target="_blank" rel="noreferrer" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Request 311 service</a>
              <a href="https://ladotlivestreetsweeping.lacity.org" target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-sm font-medium">Sweeping map</a>
            </div>
          </Tile>
          <Tile title="Your representatives" icon={<Landmark className="h-4 w-4" />} className="bg-sunset text-accent-foreground">
            {d.council ? (
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-card font-display text-xl font-bold text-primary" aria-hidden>{initials}</div>
                <div>
                  <p className="font-display text-2xl font-bold">{d.council.member}</p>
                  <p className="text-sm opacity-80">Council District {d.council.district}</p>
                </div>
              </div>
            ) : <p>No council district found.</p>}
            <ul className="mt-4 space-y-1.5 text-sm">
              {d.council && <li>📍 Office: <a className="font-semibold underline" href={d.council.url} target="_blank" rel="noreferrer">cd{d.council.district}.lacity.gov</a></li>}
              <li>☎️ Constituent help: call <strong>3-1-1</strong> or (213) 473-3231</li>
              {d.supervisor && <li>🏛️ County Supervisor: <a className="font-semibold underline" href={d.supervisor.url} target="_blank" rel="noreferrer">{d.supervisor.name ?? "Board of Supervisors"}</a> (District {d.supervisor.district})</li>}
              {d.congress && <li>🇺🇸 U.S. Representative: <a className="font-semibold underline" href={d.congress.url} target="_blank" rel="noreferrer">{d.congress.name ?? "Find your representative"}</a> (CA-{d.congress.district})</li>}
              {d.nc && <li>👥 Neighborhood Council: <strong>{d.nc.name}</strong></li>}
              {d.nc?.empowerla && <li>🗓️ <a className="font-semibold underline" href={d.nc.empowerla} target="_blank" rel="noreferrer">NC meetings & agendas</a>{d.nc.website ? <> · <a className="underline" href={d.nc.website} target="_blank" rel="noreferrer">website</a></> : null}</li>}
            </ul>
          </Tile>
        </div>
      </Tier>

      <Tier label="Tier 2" title="Explore your neighborhood's story">
        <Tile title="Local history & lore" icon={<ScrollText className="h-4 w-4" />} className="bg-secondary text-secondary-foreground">
          {l ? (
            <>
              <blockquote className="font-display text-2xl leading-snug md:text-3xl">“{l.fact}”</blockquote>
              <p className="mt-4 text-xs opacity-80">
                {l.neighborhood ? `📍 ${l.neighborhood} · ` : ""}Source: <a href={l.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{l.source_title}</a>, {l.source_publisher}{l.source_author ? ` (${l.source_author})` : ""}{l.source_date ? `, ${l.source_date.slice(0, 4)}` : ""}
                {l.source_note ? <span className="block">{l.source_note}</span> : null}
              </p>
              {lore.length > 1 && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button className={btn} onClick={() => setI(i - 1)}><ChevronLeft className="h-3 w-3" />Prev</button>
                  <button className={btn} onClick={() => setI(i + 1)}>Next fact<ChevronRight className="h-3 w-3" /></button>
                  <button className={btn} onClick={() => setI(Math.floor(Math.random() * lore.length))}><Shuffle className="h-3 w-3" />Shuffle</button>
                  <span className="ml-auto text-xs opacity-70">{(((i % lore.length) + lore.length) % lore.length) + 1} of {lore.length}</span>
                </div>
              )}
            </>
          ) : <p>Loading local history…</p>}
        </Tile>
      </Tier>

      <Tier label="Tier 3" title="Living like a local">
        <div className="grid gap-4 md:grid-cols-3">
          <Tile title="Local press" icon={<Newspaper className="h-4 w-4" />}>
            {local.length ? <NList items={local} showCovers /> : <p className="mb-3 text-sm text-muted-foreground">No hyperlocal newsletter here yet.</p>}
            <p className="mb-2 mt-4 text-xs font-semibold text-secondary">Citywide independent</p>
            <NList items={CITYWIDE} />
          </Tile>
          <Tile title="City departments" icon={<Users className="h-4 w-4" />}>
            {d.council && <div className="mb-2 text-sm"><A href={d.council.url}>Council District {d.council.district} newsletter</A><span className="block text-xs text-muted-foreground">Sign up on {d.council.member}'s site</span></div>}
            <NList items={CITY_DEPARTMENTS} />
          </Tile>
          <Tile title="Essential LA apps" icon={<Smartphone className="h-4 w-4" />}>
            <ul className="space-y-2 text-sm">
              {APPS.map((a) => <li key={a.name}><A href={a.url}>{a.name}</A><span className="block text-xs text-muted-foreground">{a.what}</span></li>)}
            </ul>
          </Tile>
        </div>
      </Tier>
    </div>
  );
}

function NList({ items, showCovers = false }: { items: Newsletter[]; showCovers?: boolean }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((n) => (
        <li key={n.name}><A href={n.url}>{n.name}</A>
          <span className="block text-xs text-muted-foreground">{n.about}{showCovers ? ` · ${n.covers}` : ""}</span>
        </li>
      ))}
    </ul>
  );
}
