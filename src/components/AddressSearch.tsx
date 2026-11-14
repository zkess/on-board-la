import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suggestAddresses, type Suggestion } from "@/lib/la.functions";

export function AddressSearch({ initial = "", compact = false }: { initial?: string; compact?: boolean }) {
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const typed = useRef(false);
  const navigate = useNavigate();
  const suggest = useServerFn(suggestAddresses);
  const listId = useId();

  useEffect(() => {
    if (!typed.current || q.trim().length < 3) { setItems([]); return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      const res = await suggest({ data: { q: q.trim() } }).catch(() => []);
      if (!cancelled) { setItems(res); setActive(-1); setOpen(true); }
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q, suggest]);

  const go = (value: string) => {
    const v = value.trim();
    if (v.length < 2) return;
    setOpen(false);
    navigate({ to: "/explore", search: { q: v } });
  };
  const full = (s: Suggestion) => [s.label, s.detail].filter(Boolean).join(", ");
  const pick = (s: Suggestion) => { typed.current = false; setQ(full(s)); go(full(s)); };
  const showList = open && items.length > 0;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); const s = items[active]; if (showList && s) pick(s); else go(q); }}
      className={`relative flex w-full items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-soft ${compact ? "max-w-lg" : "max-w-xl"}`}
    >
      <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      <input
        value={q}
        onChange={(e) => { typed.current = true; setItems([]); setActive(-1); setOpen(false); setQ(e.target.value); }}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
          else if (e.key === "Escape") setOpen(false);
        }}
        onFocus={() => items.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type an LA address…"
        aria-label="Your address"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${compact ? "py-1.5 text-sm" : "py-3 text-lg"}`}
      />
      <Button
        type="submit"
        className={`min-h-12 rounded-full bg-accent font-bold text-accent-foreground shadow-none transition hover:-translate-y-0.5 hover:bg-accent hover:shadow-soft ${compact ? "px-4 text-base" : "px-7 text-base"}`}
      >
        Go
      </Button>
      {showList && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-[1100] mt-2 overflow-hidden rounded-2xl border border-border bg-card text-left text-foreground shadow-soft">
          {items.map((s, i) => (
            <li
              key={full(s)}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 ${i === active ? "bg-muted" : ""}`}
            >
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0"><span className="block font-semibold">{s.label}</span>{s.detail && <span className="block text-[15px] text-muted-foreground">{s.detail}</span>}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
