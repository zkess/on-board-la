import { Building2, Landmark, Trees, UtensilsCrossed } from "lucide-react";
import { A } from "@/components/NeighborhoodPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INSTITUTION_CATEGORIES, institutionsFor } from "@/lib/institutions";

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
        <p className="resource-description">No institutions listed for {neighborhood ?? "this neighborhood"} yet.</p>
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
                        {place.district && place.district !== neighborhood && <p className="mb-1 text-[15px] text-muted-foreground">{place.district}</p>}
                        <A href={place.url}>{place.name}</A>
                        <p className="resource-description mt-1">{place.about}</p>
                        {place.address && <p className="mt-2 text-[15px] text-muted-foreground">{place.address}</p>}
                        {place.sourceCredit && <p className="mt-2 text-[15px] text-muted-foreground">{place.sourceCredit}</p>}
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