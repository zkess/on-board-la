import { createFileRoute, Link, Outlet, retainSearchParams } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { lookupAddress } from "@/lib/la.functions";
import { AddressSearch } from "@/components/AddressSearch";
import { INDEPENDENT_CITIES } from "@/lib/la-data";
import { heroFor, heroSrc, heroPage, landmarkHero } from "@/lib/hero-images";
import { useEffect, useRef } from "react";
import { useRememberedAddress } from "@/hooks/use-remembered-address";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListChecks } from "lucide-react";

export const Route = createFileRoute("/explore")({
  validateSearch: zodValidator(z.object({ q: fallback(z.string(), "").default("") })),
  search: { middlewares: [retainSearchParams(["q"])] },
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    if (deps.q.trim().length < 2) return { status: "notfound" as const, query: deps.q };
    return lookupAddress({ data: { q: deps.q } });
  },
  staleTime: 5 * 60_000,
  head: ({ loaderData }) => {
    const title = loaderData && loaderData.status !== "notfound" ? `${loaderData.label.split(",")[0]} — ON BOARD LA` : "Your neighborhood — ON BOARD LA";
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

function ExploreLayout() {
  const data = Route.useLoaderData();
  const { q } = Route.useSearch();
  useRememberedAddress(q);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    const page = pageRef.current;
    if (!header || !page) return;
    const update = () => page.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={pageRef} className="dashboard-page min-h-screen">
      <header ref={headerRef} className="dashboard-header sticky top-0 z-[1000] border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-5 py-3 md:grid-cols-[auto_minmax(0,1fr)]">
          <Link to="/" className="min-w-0 font-sign text-3xl tracking-wider">ON <span className="text-twilight">BOARD</span> LA</Link>
          <div className="min-w-0 w-full md:justify-self-end md:max-w-lg"><AddressSearch key={q} initial={q} compact /></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {data.status === "ok" ? (
          <>
            <Hero query={q} approximate={!!data.approximate} label={data.label} neighborhood={data.neighborhood} nc={data.nc?.name ?? ""} region={data.nc?.region ?? ""} />
            <nav aria-label="Neighborhood pages" className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
              <Button asChild variant="ghost" className="h-10 text-[15px]">
                <Link to="/explore" search={{ q }} activeOptions={{ exact: true }} activeProps={{ className: "bg-accent text-accent-foreground" }}>
                  <LayoutDashboard aria-hidden="true" /> Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" className="h-10 text-[15px]">
                <Link to="/explore/checklist" search={{ q }} activeProps={{ className: "bg-accent text-accent-foreground" }}>
                  <ListChecks aria-hidden="true" /> Newcomer checklist
                </Link>
              </Button>
            </nav>
            <Outlet />
          </>
        ) : data.status === "outside" ? <Outside city={data.city} label={data.label} unincorporated={data.unincorporated} /> : <NotFound q={data.query} />}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-6 text-[15px] text-muted-foreground">
          Want the official version? Check the{" "}
          <a href="https://lacity.gov/neighborhoodinfo" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">City of LA Neighborhood Info lookup</a>.
        </div>
      </footer>
    </div>
  );
}

function Outside({ city, label, unincorporated }: { city: string | null; label: string; unincorporated: boolean }) {
  const portal = unincorporated ? "https://lacounty.gov/government/geography-statistics/unincorporated-areas/" : city ? INDEPENDENT_CITIES[city] : undefined;
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
      <p className="text-4xl" aria-hidden>🌴</p>
      <h1 className="mt-3 font-display text-3xl font-bold">You're just outside the City of LA</h1>
      <p className="mt-3 text-muted-foreground">
        <strong className="text-foreground">{label}</strong> {unincorporated
          ? <>is in {city ? <strong className="text-foreground">{city}</strong> : "an area"}, an unincorporated part of LA County. There's no city government here: the County Board of Supervisors acts as your local government and county departments handle services like trash — so our LA City guide won't fit quite right.</>
          : <>is in {city ? <>the independent city of <strong className="text-foreground">{city}</strong></> : "an area outside City of Los Angeles limits"}. It has its own city council, services and trash schedule — so our LA City guide won't fit quite right.</>}
      </p>
      <a href={portal ?? "https://lacounty.gov/government/geography-statistics/cities-and-communities/"} target="_blank" rel="noreferrer"
        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
        {unincorporated ? "Explore LA County services" : portal ? `Visit ${city}'s civic portal` : "Find your local government"}
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

function Hero({ query, approximate, label, neighborhood, nc, region }: { query: string; approximate: boolean; label: string; neighborhood: string | null; nc: string; region: string }) {
  const hood = neighborhood ?? (nc.replace(/ Neighborhood Council$/i, "").replace(/ NC$/i, "") || "the City of Los Angeles");
  const h = landmarkHero(query) ?? heroFor(hood, region);
  return (
    <figure className="relative mb-10">
      <div className="relative overflow-hidden rounded-[20px]">
        <img src={heroSrc(h)} alt={h.subject} width={1600} height={640} className="h-[320px] w-full object-cover" />
        <div className="hero-warm-tint pointer-events-none absolute inset-0" />
        <figcaption className="hero-credit absolute bottom-9 right-3 max-w-[calc(100%-1.5rem)] rounded-md bg-tile-light px-2 py-1 text-right text-muted-foreground">
          <a href={heroPage(h)} target="_blank" rel="noreferrer" className="hover:underline"><span className="inline-block">{h.subject} · {h.author}</span>{" · "}<span className="inline-block">{h.license} · Wikimedia Commons</span></a>
        </figcaption>
      </div>
      <div className="hero-headline relative z-10 mx-3 -mt-6 rounded-[20px] bg-tile-light p-6 text-foreground shadow-soft md:mx-6 md:p-8">
        <p className="text-xs uppercase tracking-widest">{label}</p>
        <h1 className="mt-1 font-display text-3xl font-bold md:text-5xl">We're in <mark className="rounded-sm bg-accent px-1 text-accent-foreground">{hood}</mark>.</h1>
        {approximate && <p role="note" className="mt-3 rounded-lg border border-border bg-muted px-3 py-2 text-[15px] leading-normal text-foreground">Approximate: we couldn't verify that exact building number, so this shows the general area for the street. Districts can change along a long street, so double-check with <a href="https://lacity.gov/neighborhoodinfo" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">the City's Neighborhood Info lookup</a>.</p>}
        {neighborhood && <a href="https://maps.latimes.com/about/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-[15px] leading-normal text-primary underline underline-offset-4">Neighborhood boundaries: <span className="inline-block">Mapping L.A.</span></a>}
      </div>
    </figure>
  );
}
