import { createFileRoute, Link } from "@tanstack/react-router";
import { AddressSearch } from "@/components/AddressSearch";
import { LANDMARKS } from "@/lib/la-data";
import { Star, Waves, TowerControl, TrainFront, Music, Landmark } from "lucide-react";

const spotIcons = [Star, Waves, TowerControl, TrainFront, Music, Landmark];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ON BOARD LA — Your civic welcome to Los Angeles" },
      { name: "description", content: "Enter your address to meet your Councilmember, Neighborhood Council, trash day, local press and more." },
      { property: "og:title", content: "ON BOARD LA — Your civic welcome to Los Angeles" },
      { property: "og:description", content: "Everything a new City of Los Angeles resident needs to get civically plugged in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="home-page" id="top">
      <section className="home-welcome">
        <div className="home-wrap home-intro">
          <p className="home-eyebrow">For new and aspiring Angelenos</p>
          <h1 className="home-title font-sign">ON <span className="text-primary">BOARD</span> LA</h1>
          <p className="home-subtitle">It's time to feel like a local.</p>
          <p className="home-summary">Type any Los Angeles address and get trash day, your elected officials, neighborhood news, and a little history lesson.{"\n\n"}No address handy? Try one of the famous spots below.</p>
          <div className="home-search"><AddressSearch /></div>
          <p className="home-search-note">{"\n\n"}</p>
        </div>
      </section>
      <section id="spots" className="home-spots">
        <div className="home-wrap home-section-inner">
          <p className="home-eyebrow text-accent">Famous spots</p>
          <h2 className="home-section-title text-sand">Start with a place you already know</h2>
          <p className="home-section-description">Check out the onboarding for these famous spots.</p>
          <ul className="home-spot-grid">
            {LANDMARKS.map((l, i) => {
              const Icon = spotIcons[i] ?? Landmark;
              return <li key={l.name}>
                <Link to="/explore" search={{ q: l.q }} className="home-spot">
                  <span className={`home-spot-chip home-spot-chip-${i}`}><Icon size={28} aria-hidden="true" /></span>
                  <span className="min-w-0"><span className="home-spot-name">{l.name}</span><span className="resource-description block">{l.blurb}</span></span>
                </Link>
              </li>;
            })}
          </ul>
        </div>
      </section>
      <section className="home-steps">
        <div className="home-wrap home-section-inner">
          <p className="home-eyebrow text-sunset-text">How it works</p>
          <h2 className="home-section-title">Three steps to feeling like a local</h2>
          <ol className="home-step-grid">
            <li><span className="home-step-number font-sign" aria-hidden="true">1</span><h3>Type any LA address</h3><p>A street address, a landmark, or just a neighborhood you are curious about. Start anywhere.</p></li>
            <li><span className="home-step-number font-sign" aria-hidden="true">2</span><h3>Get your neighborhood dashboard</h3><p>Trash and recycling day, your council member and county supervisor, local news, and a bit of history.</p></li>
            <li><span className="home-step-number font-sign" aria-hidden="true">3</span><h3>Keep the essentials handy</h3><p>Quick links to MyLA311, 211 LA, Metro TAP, and local radio, the same for every neighborhood.</p></li>
          </ol>
        </div>
      </section>
      <footer className="home-footer">
        <div className="home-wrap home-footer-inner">
          <p className="font-sign text-[32px]">ON BOARD LA</p>
          <p>For every Angeleno. Call <strong>3-1-1</strong> for any city service.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2"><a href="#spots">Famous spots</a><a href="#top">Search an address</a></nav>
        </div>
      </footer>
    </main>
  );
}
