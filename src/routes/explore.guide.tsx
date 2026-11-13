import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, List } from "lucide-react";
import { Panel, SECTIONS, type Id } from "./explore.dial";

export const Route = createFileRoute("/explore/guide")({
  head: () => ({ meta: [
    { title: "Neighborhood field guide — LA Onboarding" },
    { name: "description", content: "Step through your LA neighborhood one chapter at a time." },
    { property: "og:title", content: "Neighborhood field guide — LA Onboarding" },
    { property: "og:description", content: "A chapter-by-chapter civic guide for your Los Angeles address." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Guide,
});
const parent = getRouteApi("/explore");
const MODE_KEY = "la-guide-mode";

function Guide() {
  const d = parent.useLoaderData();
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"deck" | "all">("deck");
  useEffect(() => { if (localStorage.getItem(MODE_KEY) === "all") setMode("all"); }, []);
  const pick = (m: "deck" | "all") => { setMode(m); localStorage.setItem(MODE_KEY, m); };
  useEffect(() => {
    if (mode !== "deck") return;
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight") setI((x) => Math.min(x + 1, SECTIONS.length - 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(x - 1, 0));
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [mode]);
  if (d.status !== "ok") return null;

  const teaser: Record<Id, string> = {
    trash: d.trashDay ? `Trash: ${d.trashDay}` : "Pickup & sweeping",
    reps: d.council ? `${d.council.member.split(" ").slice(-1)[0]} · CD ${d.council.district}` : "Who represents you",
    history: "Stories & lore",
    press: "Newsletters to join",
    city: "City updates",
    apps: "Apps to download",
  };
  const s = SECTIONS[i] ?? SECTIONS[0];
  const num = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{mode === "deck" ? `Chapter ${i + 1} of ${SECTIONS.length}` : "All chapters"}</p>
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs shadow-soft">
          <button onClick={() => pick("deck")} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 ${mode === "deck" ? "bg-primary text-primary-foreground" : ""}`}><BookOpen className="h-3 w-3" />Guide</button>
          <button onClick={() => pick("all")} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 ${mode === "all" ? "bg-primary text-primary-foreground" : ""}`}><List className="h-3 w-3" />All at once</button>
        </div>
      </div>

      {mode === "all" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {SECTIONS.map((x, n) => (
            <section key={x.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{num(n)} · {x.label}</p>
              <Panel id={x.id} />
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5 md:flex-row">
          <nav aria-label="Chapters" className="flex gap-2 overflow-x-auto md:sticky md:top-4 md:w-60 md:shrink-0 md:flex-col md:self-start">
            {SECTIONS.map((x, n) => {
              const on = n === i, Icon = x.icon;
              return (
                <button key={x.id} onClick={() => setI(n)} aria-current={on ? "step" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${on ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card hover:border-primary"}`}>
                  <span className="font-display text-sm font-bold opacity-70">{num(n)}</span>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-sm font-medium">{x.label}</span>
                    <span className={`hidden truncate text-xs md:block ${on ? "opacity-80" : "text-muted-foreground"}`}>{teaser[x.id]}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <section key={s.id} className="min-w-0 flex-1 animate-in fade-in slide-in-from-right-4 rounded-3xl border border-border bg-card p-6 shadow-soft duration-300 md:p-8">
            <div className="mb-5 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((i + 1) / SECTIONS.length) * 100}%` }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Chapter {num(i)}</p>
            <h2 className="mb-5 font-display text-3xl font-bold">{s.label}</h2>
            <Panel id={s.id} />
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
              <button disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" />{i > 0 ? SECTIONS[i - 1]?.label : "Back"}
              </button>
              {i < SECTIONS.length - 1
                ? <button onClick={() => setI(i + 1)} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Next: {SECTIONS[i + 1]?.label}<ChevronRight className="h-4 w-4" /></button>
                : <button onClick={() => pick("all")} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">See everything at once</button>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
