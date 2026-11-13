import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Landmark, Users, Newspaper, ScrollText, Smartphone, Trash2, ExternalLink } from "lucide-react";
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

function Bento() {
  const d = parent.useLoaderData();
  if (d.status !== "ok") return null;
  const region = d.nc?.region ?? "";
  const { data: facts = [] } = useQuery(factsQuery);
  const lore = pickFacts(facts, d.nc?.name ?? "", region);
  const local = hyperlocalFor(d.nc?.name ?? "", region);
  const initials = d.council?.member.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-6">
      <Tile title="Your Councilmember" icon={<Landmark className="h-4 w-4" />} className="md:col-span-3 md:row-span-2 bg-sunset text-accent-foreground">
        {d.council ? (
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card font-display text-2xl font-bold text-primary" aria-hidden>{initials}</div>
              <div>
                <p className="font-display text-3xl font-bold">{d.council.member}</p>
                <p className="opacity-80">Council District {d.council.district}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>📍 Office & photo: <a className="font-semibold underline" href={d.council.url} target="_blank" rel="noreferrer">cd{d.council.district}.lacity.gov</a></li>
              <li>☎️ Constituent services: call <strong>3-1-1</strong> or (213) 473-3231 from outside LA</li>
              <li>📝 Request help with city services through the district office's contact form</li>
              <li>🏛️ City Hall, 200 N Spring St, Los Angeles 90012</li>
            </ul>
          </div>
        ) : <p>No council district found.</p>}
      </Tile>

      <Tile title="Trash & streets" icon={<Trash2 className="h-4 w-4" />} className="md:col-span-3">
        <p className="font-display text-3xl font-bold">{d.trashDay ?? "—"}</p>
        <p className="text-sm text-muted-foreground">Trash, recycling & green bins{d.sanitationDistrict ? ` · ${d.sanitationDistrict} district` : ""}. Bins out by 6 a.m.</p>
        <p className="mt-3 text-sm">Street sweeping varies block by block — check the signs, or <A href="https://ladotlivestreetsweeping.lacity.org">look up your route</A>.</p>
        <p className="mt-1 text-sm">Bulky item pickup is free: <A href="https://myla311.lacity.gov">request on MyLA311</A></p>
      </Tile>

      <Tile title="Neighborhood Council" icon={<Users className="h-4 w-4" />} className="md:col-span-3">
        {d.nc ? (
          <>
            <p className="font-display text-2xl font-bold">{d.nc.name}</p>
            <p className="text-sm text-muted-foreground">{d.nc.region}</p>
            <p className="mt-3 text-sm">Meets monthly and is open to anyone who lives, works or owns property here. Meeting times & agendas:</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {d.nc.website && <A href={d.nc.website}>Website</A>}
              {d.nc.empowerla && <A href={d.nc.empowerla}>Calendar & agendas</A>}
              {d.nc.email && <a className="text-primary" href={`mailto:${d.nc.email}`}>{d.nc.email}</a>}
            </div>
          </>
        ) : <p className="text-sm">No Neighborhood Council found for this point.</p>}
      </Tile>

      <Tile title="Newsletters" icon={<Newspaper className="h-4 w-4" />} className="md:col-span-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold text-secondary">Your neighborhood</p>
            {local.length ? <NList items={local} showCovers /> : <p className="text-sm text-muted-foreground">No hyperlocal newsletter found for this area yet — try Crosstown for block-level news.</p>}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-secondary">City of LA departments</p>
            <ul className="space-y-2 text-sm">
              {d.council && <li><A href={d.council.url}>Council District {d.council.district} newsletter</A><span className="block text-xs text-muted-foreground">Sign up on {d.council.member}'s site</span></li>}
            </ul>
            <div className="mt-2"><NList items={CITY_DEPARTMENTS} /></div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-secondary">Citywide independent</p>
            <NList items={CITYWIDE} />
          </div>
        </div>
      </Tile>

      <Tile title="Local history & lore" icon={<ScrollText className="h-4 w-4" />} className="md:col-span-3 bg-secondary text-secondary-foreground">
        <div className="space-y-3 font-display text-lg leading-snug">
          {lore.map((l) => (
            <div key={l.id}>
              <p>{l.fact}</p>
              <p className="mt-1 font-sans text-xs opacity-80">
                Source: <a href={l.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{l.source_title}</a>, {l.source_publisher}{l.source_author ? ` (${l.source_author})` : ""}{l.source_date ? `, ${l.source_date.slice(0, 4)}` : ""}
                {l.source_note ? <span className="block">{l.source_note}</span> : null}
              </p>
            </div>
          ))}
        </div>
      </Tile>

      <Tile title="Essential apps" icon={<Smartphone className="h-4 w-4" />} className="md:col-span-3">
        <ul className="space-y-2 text-sm">
          {APPS.map((a) => <li key={a.name}><A href={a.url}>{a.name}</A><span className="block text-xs text-muted-foreground">{a.what}</span></li>)}
        </ul>
      </Tile>
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
