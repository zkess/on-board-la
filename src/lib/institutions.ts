import data from "@/data/neighborhood-institutions.json";

export const INSTITUTION_CATEGORIES = ["Parks", "Restaurants", "Buildings", "Cultural centers"] as const;
export type InstitutionCategory = typeof INSTITUTION_CATEGORIES[number];
export type Institution = {
  id: string;
  name: string;
  neighborhood: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  about: string;
  url: string;
  sourceUrl?: string;
};
export const INSTITUTIONS: Institution[] = data;

// Match the displayed Times neighborhood only, never a council or region fallback.
export function institutionsFor(neighborhood: string | null): Institution[] {
  if (!neighborhood) return [];
  const name = neighborhood.trim().toLowerCase();
  return INSTITUTIONS.filter((place) => place.neighborhood.toLowerCase() === name);
}