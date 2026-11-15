import { Building2, ExternalLink, Landmark, MapPin, Trees, UtensilsCrossed } from "lucide-react";
import { A } from "@/components/NeighborhoodPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INSTITUTION_CATEGORIES, institutionSearchUrl, institutionsFor } from "@/lib/institutions";
import { Button } from "@/components/ui/button";

const icons = { Parks: Trees, Restaurants: UtensilsCrossed, Buildings: Building2, "Cultural centers": Landmark };

export function NeighborhoodInstitutions({ neighborhood }: { neighborhood: string | null }) {
  const places = institutionsFor(neighborhood);
  const categories = INSTITUTION_CATEGORIES.filter((category) => places.some((place) => place.category === category));
  const views = ["All", ...categories];
  return (
    <section id="institutions" aria-labelledby="institutions-heading" className="mt-8">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="institutions-heading" className="card-heading font-bold text-foreground">Neighborhood institutions</h3>
        {neighborhood && <p className="text-[15px] text-muted-foreground">{neighborhood}</p>}
      </div>
      {places.length === 0 ? (
        <div className="border-t border-border pt-4">
          <p className="resource-description">We’re still gathering local favorites{neighborhood ? ` in ${neighborhood}` : " for this neighborhood"}.</p>
          {neighborhood && <>
            <p className="resource-description mt-1">Explore places in {neighborhood} on Google Maps.</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {INSTITUTION_CATEGORIES.map((category) => {
                const Icon = icons[category];
                return <li key={category}>
                  <Button asChild variant="outline" className="h-auto min-h-12 w-full justify-start whitespace-normal py-3 text-[15px]">
                    <a href={institutionSearchUrl(neighborhood, category)} target="_blank" rel="noreferrer">
                      <Icon aria-hidden="true" /><span className="min-w-0">{category}</span><ExternalLink aria-hidden="true" className="ml-auto" />
                    </a>
                  </Button>
                </li>;
              })}
            </ul>
          </>}
        </div>
      ) : (
        <Tabs defaultValue="All" key={neighborhood}>
          <TabsList aria-label="Institution categories" className="flex h-auto w-fit max-w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            {views.map((view) => <TabsTrigger key={view} value={view} className="min-h-11 whitespace-normal px-4 text-[15px] text-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">{view}</TabsTrigger>)}
          </TabsList>
          {views.map((view) => (
            <TabsContent key={view} value={view} className="mt-6">
              <ul className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                {places.filter((place) => view === "All" || place.category === view).map((place) => {
                  const Icon = icons[place.category as keyof typeof icons] ?? Landmark;
                  return (
                    <li key={place.id} className="flex min-w-0 gap-3 border-t border-border pt-4">
                      <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="mb-1 text-[15px] text-muted-foreground">{place.category}</p>
                        <A href={place.url}>{place.name}</A>
                        <p className="mt-1 flex items-center gap-1 text-[15px] text-muted-foreground">
                          {place.linkKind === "map" ? <><MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />Google Maps search</> : <><ExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />Website</>}
                        </p>
                        <p className="resource-description mt-1">{place.about}</p>
                        {place.address && <p className="mt-2 text-[15px] text-muted-foreground">{place.address}</p>}
                        {place.sourceCredit && !place.sourceCredit.includes("Not yet audited") && <p className="mt-2 text-[15px] text-muted-foreground">{place.sourceCredit}</p>}
                        {place.sourceUrl && <a href={place.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[15px] text-primary underline underline-offset-4">Source</a>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
}