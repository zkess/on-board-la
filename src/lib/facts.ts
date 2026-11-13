import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { regionKey } from "@/lib/region";
import type { Tables } from "@/integrations/supabase/types";

export type Fact = Tables<"neighborhood_facts">;

export const factsQuery = queryOptions({
  queryKey: ["neighborhood_facts"],
  queryFn: async () => {
    const { data, error } = await supabase.from("neighborhood_facts").select("*");
    if (error) throw error;
    return data;
  },
  staleTime: 60 * 60 * 1000,
});

/** Facts for an area: this neighborhood's own facts first, then region-wide ones, then others in the region. */
export function pickFacts(facts: Fact[], ncName: string, region: string, max = 3): Fact[] {
  const nc = ncName.toLowerCase();
  const key = regionKey(region);
  const inRegion = key ? facts.filter((f) => regionKey(f.region) === key) : [];
  const score = (f: Fact) => (f.neighborhood && nc.includes(f.neighborhood.toLowerCase()) ? 0 : f.neighborhood ? 2 : 1);
  const picked = [...inRegion].sort((a, b) => score(a) - score(b)).slice(0, max);
  return picked.length ? picked : facts.filter((f) => f.region === "Central" && !f.neighborhood).slice(0, 1);
}
