import { queryOptions } from "@tanstack/react-query";
import { regionKey } from "@/lib/region";
import factsData from "@/data/neighborhood-facts.json";

export type Fact = {
  id: string;
  region: string;
  neighborhood: string | null;
  fact: string;
  source_title: string;
  source_publisher: string;
  source_author: string | null;
  source_date: string | null;
  source_url: string;
  source_note: string | null;
  created_at: string;
};

/** All facts, read from the bundled JSON file so they can be audited and edited directly. */
export const FACTS = factsData as Fact[];

export const factsQuery = queryOptions({
  queryKey: ["neighborhood_facts"],
  queryFn: async () => FACTS,
  staleTime: Infinity,
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
