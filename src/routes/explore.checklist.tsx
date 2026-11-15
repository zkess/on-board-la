import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { checklistFor } from "@/lib/checklist";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/explore/checklist")({
  head: () => ({ meta: [
    { title: "Newcomer checklist — ON BOARD LA" },
    { name: "description", content: "Your first 30 days of civic life in Los Angeles." },
    { property: "og:title", content: "Newcomer checklist — ON BOARD LA" },
    { property: "og:description", content: "Track your first month of getting connected in Los Angeles." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Checklist,
});
const KEY = "la-onboarding-checklist";
const parent = getRouteApi("/explore");

function Checklist() {
  const data = parent.useLoaderData();
  const phases = checklistFor(data);
  const total = phases.reduce((n, p) => n + p.items.length, 0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) ?? "{}")); } catch { /* ignore */ } }, []);
  const save = (n: Record<string, boolean>) => { try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* Allow progress when storage is unavailable. */ } return n; };
  const toggle = (id: string) => setDone((d) => save({ ...d, [id]: !d[id] }));
  const count = phases.flatMap((p) => p.items).filter((i) => done[i.id]).length;
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-display text-3xl font-bold">Your first 30 days in LA</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">{count} of {total} done</span>
            {count > 0 && (
              <Button variant="ghost" onClick={() => setDone(save({}))} className="inline-flex items-center gap-1 text-primary">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Checklist completion" aria-valuemin={0} aria-valuenow={count} aria-valuemax={total}>
          <div className="h-full bg-sunset transition-all" style={{ width: `${(count / total) * 100}%` }} />
        </div>
        <p className="mt-3 text-muted-foreground">Your progress is saved on this device.</p>
        {data.status === "outside" && <p className="resource-description mt-2">These county- and state-level essentials apply across the region. City of LA services are excluded; contact your local government for utilities, parking and representatives.</p>}
        {data.status === "notfound" && <p className="resource-description mt-2">{data.query ? "We couldn't find that address. " : ""}Enter a City of LA address above for local representatives, news and pickup information. Tasks marked “City of LA” apply only within city limits.</p>}
      </div>
      <div className="space-y-8">
        {phases.map((p) => {
          const n = p.items.filter((i) => done[i.id]).length;
          return (
            <section key={p.phase} className="border-t border-border pt-6">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="card-heading text-primary">{p.phase}</h3>
                  <p className="text-muted-foreground">{p.subtitle}</p>
                </div>
                <span className="text-muted-foreground">{n}/{p.items.length}</span>
              </div>
              <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {p.items.map((it) => (
                  <li key={it.id} className="flex gap-3">
                    <Checkbox checked={!!done[it.id]} onCheckedChange={() => toggle(it.id)} aria-label={it.text} className="mt-1 h-6 w-6 shrink-0 border-2" />
                    <div className={`min-w-0 ${done[it.id] ? "opacity-60" : ""}`}>
                      <span className="mb-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs uppercase">{it.tag}</span>
                      {it.cityOnly && <span className="mb-1 ml-2 inline-block text-xs text-muted-foreground">City of LA</span>}
                      <div className={`font-semibold ${done[it.id] ? "line-through" : ""}`}>
                        {it.link ? <a className="resource-link" href={it.link} target="_blank" rel="noreferrer">{it.text}</a> : it.text}
                      </div>
                      {it.tip && <p className="resource-description">{it.tip}</p>}
                      {it.resources && it.resources.length > 0 && <ul className="mt-2 space-y-2">{it.resources.map((resource) => <li key={resource.url}><a className="resource-link" href={resource.url} target="_blank" rel="noreferrer">{resource.name}</a></li>)}</ul>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
