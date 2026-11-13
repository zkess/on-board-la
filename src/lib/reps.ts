/** Officeholders by district, current as of Nov 2026 (2021 district maps). District lines come live from LA County GIS. */
export const SUPERVISORS: Record<number, string> = {
  1: "Hilda L. Solis", 2: "Holly J. Mitchell", 3: "Lindsey P. Horvath", 4: "Janice Hahn", 5: "Kathryn Barger",
};
export const SUPERVISORS_URL = "https://bos.lacounty.gov/";

export const HOUSE: Record<number, { name: string; url: string }> = {
  27: { name: "George Whitesides", url: "https://whitesides.house.gov" },
  28: { name: "Judy Chu", url: "https://chu.house.gov" },
  29: { name: "Luz Rivas", url: "https://rivas.house.gov" },
  30: { name: "Laura Friedman", url: "https://friedman.house.gov" },
  32: { name: "Brad Sherman", url: "https://sherman.house.gov" },
  34: { name: "Jimmy Gomez", url: "https://gomez.house.gov" },
  36: { name: "Ted Lieu", url: "https://lieu.house.gov" },
  37: { name: "Sydney Kamlager-Dove", url: "https://kamlager-dove.house.gov" },
  38: { name: "Linda Sánchez", url: "https://lindasanchez.house.gov" },
  42: { name: "Robert Garcia", url: "https://robertgarcia.house.gov" },
  43: { name: "Maxine Waters", url: "https://waters.house.gov" },
  44: { name: "Nanette Barragán", url: "https://barragan.house.gov" },
};
