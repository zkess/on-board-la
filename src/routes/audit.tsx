import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { factsQuery } from "@/lib/facts";
import { HERO_IMAGES, HERO_BY_NC, HERO_BY_REGION, heroSrc, heroPage } from "@/lib/hero-images";
import { SUPERVISORS, SUPERVISORS_URL, HOUSE } from "@/lib/reps";
import { LANDMARKS } from "@/lib/la-data";
import { lookupAddress, type Lookup } from "@/lib/la.functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Data audit — ON BOARD LA" },
      { name: "description", content: "Internal review of neighborhood facts, photos, trash days and representatives." },
      { property: "og:title", content: "Data audit — ON BOARD LA" },
      { property: "og:description", content: "Internal data review page." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Audit,
});

function Audit() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-4xl">Data audit</h1>
      <p className="mt-2 resource-description">Review everything the dashboard shows. Corrections can be requested in chat.</p>
      <Tabs defaultValue="facts" className="mt-6">
        <TabsList>
          <TabsTrigger value="facts">Facts</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="reps">Representatives</TabsTrigger>
          <TabsTrigger value="addresses">Trash & address test</TabsTrigger>
        </TabsList>
        <TabsContent value="facts"><Facts /></TabsContent>
        <TabsContent value="photos"><Photos /></TabsContent>
        <TabsContent value="reps"><Reps /></TabsContent>
        <TabsContent value="addresses"><Addresses /></TabsContent>
      </Tabs>
    </main>
  );
}

function Facts() {
  const { data = [], isLoading, error } = useQuery(factsQuery);
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const regions = useMemo(() => [...new Set(data.map((f) => f.region))].sort(), [data]);
  const rows = data
    .filter((f) => !region || f.region === region)
    .filter((f) => !q || JSON.stringify(f).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a.region + (a.neighborhood ?? "")).localeCompare(b.region + (b.neighborhood ?? "")));
  if (isLoading) return <p className="py-6">Loading facts…</p>;
  if (error) return <p className="py-6">Could not load facts.</p>;
  return (
    <section className="py-6">
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search facts, sources…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-md border border-input bg-background px-3">
          <option value="">All regions</option>
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>
        <span className="self-center resource-description">{rows.length} of {data.length}</span>
        <Button variant="outline" onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "neighborhood-facts.json"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000); }}>Download facts JSON</Button>
      </div>
      <ol className="mt-6 space-y-4">
        {rows.map((f) => (
          <li key={f.id} className="rounded-xl border border-border bg-card p-4">
            <p className="uppercase text-muted-foreground">{f.region}{f.neighborhood ? ` · ${f.neighborhood}` : " · region-wide"}</p>
            <p className="mt-1">{f.fact}</p>
            <p className="mt-2 resource-description">
              <a className="resource-link" href={f.source_url} target="_blank" rel="noreferrer">{f.source_title}</a>
              {" — "}{f.source_publisher}{f.source_author ? `, ${f.source_author}` : ""}{f.source_date ? `, ${f.source_date}` : ""}
            </p>
            {f.source_note && <p className="resource-description italic">{f.source_note}</p>}
            <p className="mt-1 text-muted-foreground" style={{ fontSize: 12 }}>ID {f.id}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Photos() {
  return (
    <section className="grid gap-6 py-6 md:grid-cols-2">
      {Object.entries(HERO_IMAGES).map(([key, h]) => {
        const nc = HERO_BY_NC.filter(([, img]) => img === h).map(([r]) => r.source);
        const reg = HERO_BY_REGION.filter(([, img]) => img === h).map(([r]) => r.source);
        return (
          <article key={key} className="overflow-hidden rounded-xl border border-border bg-card">
            <img src={heroSrc(h)} alt={h.subject} className="h-48 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <a className="resource-link" href={heroPage(h)} target="_blank" rel="noreferrer">{h.subject}</a>
              <p className="resource-description">{h.author} · {h.license}{key === "cityHall" ? " · default fallback" : ""}</p>
              <p className="mt-2 resource-description">Neighborhood councils: {nc.join(", ") || "—"}</p>
              <p className="resource-description">Regions: {reg.join(", ") || "—"}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function Reps() {
  return (
    <section className="grid gap-6 py-6 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="card-heading">County Supervisors</h2>
        <ul className="mt-3 resource-list">
          {Object.entries(SUPERVISORS).map(([d, n]) => <li key={d}>District {d}: {n}</li>)}
        </ul>
        <a className="resource-link mt-3 inline-block" href={SUPERVISORS_URL} target="_blank" rel="noreferrer">Verify at bos.lacounty.gov</a>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="card-heading">U.S. House</h2>
        <ul className="mt-3 resource-list">
          {Object.entries(HOUSE).map(([d, h]) => <li key={d}>CA-{d}: <a className="resource-link" href={h.url} target="_blank" rel="noreferrer">{h.name}</a></li>)}
        </ul>
      </div>
      <p className="resource-description md:col-span-2">City Council members and Neighborhood Councils come live from City of LA map data — check them in the address test tab.</p>
    </section>
  );
}

function Addresses() {
  const [extra, setExtra] = useState("");
  const [list, setList] = useState(LANDMARKS.map((l) => l.q));
  const [results, setResults] = useState<Record<string, Lookup | "loading" | "error">>({});
  const [running, setRunning] = useState(false);
  const run = async (qs: string[]) => {
    setRunning(true);
    for (const q of qs) {
      setResults((r) => ({ ...r, [q]: "loading" }));
      try { const res = await lookupAddress({ data: { q } }); setResults((r) => ({ ...r, [q]: res })); }
      catch { setResults((r) => ({ ...r, [q]: "error" })); }
      await new Promise((s) => setTimeout(s, 1100)); // map lookup service allows ~1 request/second
    }
    setRunning(false);
  };
  return (
    <section className="py-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => run(list)} disabled={running}>{running ? "Checking…" : "Check all addresses"}</Button>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const q = extra.trim(); if (q.length < 2) return; setList((l) => [q, ...l]); setExtra(""); run([q]); }}>
          <Input placeholder="Add an address to test" value={extra} onChange={(e) => setExtra(e.target.value)} className="w-72" />
          <Button type="submit" variant="outline" disabled={running}>Test</Button>
        </form>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left" style={{ fontSize: 15 }}>
          <thead><tr className="border-b border-border">
            {["Address", "Neighborhood", "Council", "Neighborhood Council", "Trash day", "Supervisor", "Congress"].map((h) => <th key={h} className="p-2 uppercase">{h}</th>)}
          </tr></thead>
          <tbody>
            {list.map((q) => {
              const r = results[q];
              const ok = r && typeof r === "object" && r.status === "ok" ? r : null;
              return (
                <tr key={q} className="border-b border-border align-top">
                  <td className="p-2">{q}{r && typeof r === "object" && r.status !== "ok" && <span className="block text-muted-foreground">{r.status === "outside" ? `Outside LA (${r.city ?? "?"})` : "Not found"}</span>}{r === "error" && <span className="block text-destructive">Lookup failed</span>}{r === "loading" && <span className="block text-muted-foreground">Checking…</span>}</td>
                  <td className="p-2">{ok?.neighborhood ?? "—"}</td>
                  <td className="p-2">{ok?.council ? `CD${ok.council.district}: ${ok.council.member}` : "—"}</td>
                  <td className="p-2">{ok?.nc?.name ?? "—"}</td>
                  <td className="p-2">{ok ? `${ok.trashDay ?? "—"}${ok.sanitationDistrict ? ` (${ok.sanitationDistrict})` : ""}` : "—"}</td>
                  <td className="p-2">{ok?.supervisor ? `D${ok.supervisor.district}: ${ok.supervisor.name ?? "?"}` : "—"}</td>
                  <td className="p-2">{ok?.congress ? `CA-${ok.congress.district}: ${ok.congress.name ?? "?"}` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
