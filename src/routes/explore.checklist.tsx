import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CHECKLIST } from "@/lib/la-data";

export const Route = createFileRoute("/explore/checklist")({
  head: () => ({ meta: [
    { title: "Newcomer checklist — ON BOARD LA" },
    { name: "description", content: "Your first 30 days of civic life in Los Angeles." },
    { property: "og:title", content: "Newcomer checklist — ON BOARD LA" },
    { property: "og:description", content: "Track your first month of getting connected in Los Angeles." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Checklist,
});
const KEY = "la-onboarding-checklist";
const total = CHECKLIST.reduce((n, p) => n + p.items.length, 0);

function Checklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) ?? "{}")); } catch { /* ignore */ } }, []);
  const toggle = (id: string) => setDone((d) => { const n = { ...d, [id]: !d[id] }; localStorage.setItem(KEY, JSON.stringify(n)); return n; });
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div>
      <div className="mb-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-baseline justify-between"><h2 className="font-display text-2xl font-bold">Your first 30 days</h2><span className="text-sm text-muted-foreground">{count} / {total} done</span></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-sunset transition-all" style={{ width: `${(count / total) * 100}%` }} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {CHECKLIST.map((p) => (
          <section key={p.phase} className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-2xl font-bold text-primary">{p.phase}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{p.subtitle}</p>
            <ul className="space-y-3">
              {p.items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <button onClick={() => toggle(it.id)} aria-pressed={!!done[it.id]} aria-label={it.text}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${done[it.id] ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {done[it.id] && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <span className={`text-sm ${done[it.id] ? "text-muted-foreground line-through" : ""}`}>
                    {it.text}{it.link && <> · <a className="text-primary underline" href={it.link} target="_blank" rel="noreferrer">link</a></>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
