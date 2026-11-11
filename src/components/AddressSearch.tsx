import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";

export function AddressSearch({ initial = "", compact = false }: { initial?: string; compact?: boolean }) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim().length > 1) navigate({ to: "/explore", search: { q: q.trim() } });
      }}
      className={`flex w-full items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-soft ${compact ? "max-w-md" : "max-w-xl"}`}
    >
      <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type your LA address…"
        aria-label="Your address"
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${compact ? "py-1.5 text-sm" : "py-3 text-lg"}`}
      />
      <button type="submit" className={`rounded-full bg-primary font-medium text-primary-foreground transition hover:opacity-90 ${compact ? "px-4 py-1.5 text-sm" : "px-6 py-3"}`}>
        Go
      </button>
    </form>
  );
}
