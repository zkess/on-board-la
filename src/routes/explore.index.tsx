import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Landmark, Users, Newspaper, ScrollText, Smartphone, Trash2, ExternalLink } from "lucide-react";
import { APPS, HYPERLOCAL, LORE, NEWSLETTERS } from "@/lib/la-data";

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
  const lore = LORE.filter((l) => l.match.test(region));
  const local = HYPERLOCAL.filter((h) => h.match.test(region));
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

      <Tile title="Newsletters" icon={<Newspaper className="h-4 w-4" />} className="md:col-span-2">
        {local.length > 0 && <><p className="mb-1 text-xs font-semibold text-secondary">Hyperlocal</p>
          <ul className="mb-3 space-y-1 text-sm">{local.map((n) => <li key={n.name}><A href={n.url}>{n.name}</A></li>)}</ul></>}
        <p className="mb-1 text-xs font-semibold text-secondary">Citywide independent</p>
        <ul className="space-y-1 text-sm">{NEWSLETTERS.citywide.map((n) => <li key={n.name}><A href={n.url}>{n.name}</A></li>)}</ul>
      </Tile>

      <Tile title="Local history & lore" icon={<ScrollText className="h-4 w-4" />} className="md:col-span-2 bg-secondary text-secondary-foreground">
        <div className="space-y-3 font-display text-lg leading-snug">
          {(lore.length ? lore : LORE.slice(-1)).map((l, i) => <p key={i}>{l.text}</p>)}
        </div>
      </Tile>

      <Tile title="Essential apps" icon={<Smartphone className="h-4 w-4" />} className="md:col-span-2">
        <ul className="space-y-2 text-sm">
          {APPS.map((a) => <li key={a.name}><A href={a.url}>{a.name}</A><span className="block text-xs text-muted-foreground">{a.what}</span></li>)}
        </ul>
      </Tile>
    </div>
  );
}
