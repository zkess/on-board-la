import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { CHECKLIST } from "@/lib/la-data";

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
const total = CHECKLIST.reduce((n, p) => n + p.items.length, 0);

function Checklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) ?? "{}")); } catch { /* ignore */ } }, []);
  const save = (n: Record<string, boolean>) => { localStorage.setItem(KEY, JSON.stringify(n)); return n; };
  const toggle = (id: string) => setDone((d) => save({ ...d, [id]: !d[id] }));
  const count = CHECKLIST.flatMap((p) => p.items).filter((i) => done[i.id]).length;
  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="card-heading">Your first 30 days in LA</h2>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">{count} of {total} done</span>
            {count > 0 && (
              <button onClick={() => setDone(save({}))} className="inline-flex items-center gap-1 text-primary underline">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={count} aria-valuemax={total}>
          <div className="h-full bg-sunset transition-all" style={{ width: `${(count / total) * 100}%` }} />
        </div>
        <p className="mt-3 text-muted-foreground">Your progress is saved on this device.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {CHECKLIST.map((p) => {
          const n = p.items.filter((i) => done[i.id]).length;
          return (
            <section key={p.phase} className="rounded-[20px] border border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="card-heading text-primary">{p.phase}</h3>
                <span className="text-muted-foreground">{n}/{p.items.length}</span>
              </div>
              <p className="mb-4 text-muted-foreground">{p.subtitle}</p>
              <ul className="resource-list">
                {p.items.map((it) => (
                  <li key={it.id} className="flex gap-3">
                    <button onClick={() => toggle(it.id)} aria-pressed={!!done[it.id]} aria-label={it.text}
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${done[it.id] ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {done[it.id] && <Check className="h-4 w-4" />}
                    </button>
                    <div className={done[it.id] ? "opacity-60" : ""}>
                      <span className="mb-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs uppercase">{it.tag}</span>
                      <div className={`font-semibold ${done[it.id] ? "line-through" : ""}`}>
                        {it.link ? <a className="resource-link" href={it.link} target="_blank" rel="noreferrer">{it.text}</a> : it.text}
                      </div>
                      {it.tip && <p className="resource-description">{it.tip}</p>}
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
