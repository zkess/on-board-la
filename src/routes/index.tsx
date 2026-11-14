import { createFileRoute, Link } from "@tanstack/react-router";
import { AddressSearch } from "@/components/AddressSearch";
import { LANDMARKS } from "@/lib/la-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LA Onboarding — Your civic welcome to Los Angeles" },
      { name: "description", content: "Enter your address to meet your Councilmember, Neighborhood Council, trash day, local press and more." },
      { property: "og:title", content: "LA Onboarding" },
      { property: "og:description", content: "Everything a new City of Los Angeles resident needs to get civically plugged in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
      <h1 className="relative text-center font-sign text-7xl font-normal md:text-9xl sign-title">
        ON <span className="text-primary">BOARD LA</span>
      </h1>
      <p className="relative mt-4 max-w-md text-center text-muted-foreground">New or aspiring resident? It's time to get up to speed.</p>
      <div className="relative mt-10 flex w-full justify-center"><AddressSearch /></div>
      <p className="relative mt-12 text-sm text-muted-foreground">Check out the onboarding for these famous spots.</p>
      <ul className="relative mt-4 flex max-w-3xl flex-wrap justify-center gap-3">
        {LANDMARKS.map((l) => (
          <li key={l.name}>
            <Link to="/explore" search={{ q: l.q }} className="block rounded-2xl border border-border bg-card px-4 py-3 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft">
              <span className="block font-display text-lg font-semibold">{l.name}</span>
              <span className="block text-xs text-muted-foreground">{l.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
