import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { lookupAddress } from "@/lib/la.functions";
import { AddressSearch } from "@/components/AddressSearch";
import { INDEPENDENT_CITIES } from "@/lib/la-data";
import { heroFor, heroSrc, heroPage } from "@/lib/hero-images";

export const Route = createFileRoute("/explore")({
  validateSearch: z.object({ q: z.string().catch("") }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    if (deps.q.trim().length < 2) return { status: "notfound" as const, query: deps.q };
    return lookupAddress({ data: { q: deps.q } });
  },
  staleTime: 5 * 60_000,
  head: ({ loaderData }) => {
    const title = loaderData && loaderData.status !== "notfound" ? `${loaderData.label.split(",")[0]} — LA Onboarding` : "Your neighborhood — LA Onboarding";
    return {
      meta: [
        { title },
        { name: "description", content: "Your Councilmember, Neighborhood Council, trash day, local press and civic checklist." },
        { property: "og:title", content: title },
        { property: "og:description", content: "A civic onboarding dashboard for your Los Angeles address." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      <p className="animate-pulse font-display text-2xl">Finding your corner of LA…</p>
    </div>
  ),
  component: ExploreLayout,
});

const tabs = [
  { to: "/explore", label: "Dashboard" },
  // Temporarily hidden while we focus on the dashboard:
  // { to: "/explore/checklist", label: "Newcomer Checklist" },
  // { to: "/explore/map", label: "Interactive Map" },
] as const;

function ExploreLayout() {
  const data = Route.useLoaderData();
  const { q } = Route.useSearch();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-3">
          <Link to="/" className="font-display text-xl font-bold">LA <span className="italic text-primary">Onboarding</span></Link>
          {data.status === "ok" && (
            <nav className="flex gap-1 rounded-full bg-muted p-1 text-sm">
              {tabs.map((t) => (
                <Link key={t.to} to={t.to} search={{ q }} activeOptions={{ exact: true, includeSearch: false }}
                  className="rounded-full px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
                  activeProps={{ className: "bg-card text-foreground shadow-soft underline decoration-accent decoration-[3px] underline-offset-8" }}>
                  {t.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="ml-auto w-full md:w-auto"><AddressSearch key={q} initial={q} compact /></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {data.status === "ok" ? (
          <>
            <Hero label={data.label} neighborhood={data.neighborhood} nc={data.nc?.name ?? ""} region={data.nc?.region ?? ""} />
            <Outlet />
          </>
        ) : data.status === "outside" ? <Outside city={data.city} label={data.label} /> : <NotFound q={data.query} />}
      </main>
    </div>
  );
}

function Outside({ city, label }: { city: string | null; label: string }) {
  const portal = city ? INDEPENDENT_CITIES[city] : undefined;
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
      <p className="text-4xl" aria-hidden>🌴</p>
      <h1 className="mt-3 font-display text-3xl font-bold">You're just outside the City of LA</h1>
      <p className="mt-3 text-muted-foreground">
        <strong className="text-foreground">{label}</strong> is in {city ? <>the independent city of <strong className="text-foreground">{city}</strong></> : "an area outside City of Los Angeles limits"}. It has its own city council, services and trash schedule — so our LA City guide won't fit quite right.
      </p>
      <a href={portal ?? "https://lacounty.gov/government/geography-statistics/cities-and-communities/"} target="_blank" rel="noreferrer"
        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
        {portal ? `Visit ${city}'s civic portal` : "Find your local government"}
      </a>
    </div>
  );
}

function NotFound({ q }: { q: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
      <h1 className="font-display text-3xl font-bold">We couldn't find that address</h1>
      <p className="mt-3 text-muted-foreground">{q ? <>No match for “{q}” in LA County. </> : null}Try a street address with a cross-street or ZIP code.</p>
    </div>
  );
}

function Hero({ label, neighborhood, nc, region }: { label: string; neighborhood: string | null; nc: string; region: string }) {
  const hood = neighborhood ?? (nc.replace(/ Neighborhood Council$/i, "").replace(/ NC$/i, "") || "the City of Los Angeles");
  const h = heroFor(hood, region);
  return (
    <figure className="relative mb-10 overflow-hidden rounded-3xl shadow-soft">
      <img src={heroSrc(h)} alt={h.subject} width={1600} height={640} className="h-64 w-full object-cover md:h-80" />
      <div className="pointer-events-none absolute inset-0 bg-accent/10" />
      <div className="absolute inset-x-0 bottom-0 bg-twilight/80 p-6 text-background md:p-8">
        <p className="text-xs uppercase tracking-widest">{label}</p>
        <h1 className="mt-1 font-display text-3xl font-bold md:text-5xl">We're in <mark className="rounded-sm bg-accent/60 px-1 text-accent-foreground">{hood}</mark>.</h1>
        {neighborhood && <a href="https://maps.latimes.com/about/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-background underline underline-offset-4">Neighborhood boundaries: Los Angeles Times Mapping L.A.</a>}
      </div>
      <figcaption className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] rounded-md bg-background px-2 py-1 text-xs text-muted-foreground">
        <a href={heroPage(h)} target="_blank" rel="noreferrer" className="hover:underline">{h.subject} · {h.author} · {h.license} · Wikimedia Commons</a>
      </figcaption>
    </figure>
  );
}
