/** Header photos from Wikimedia Commons. Each carries its author + license so it can be credited on screen. */
export type HeroImage = { file: string; subject: string; author: string; license: string };

export const HERO_IMAGES = {
  griffith: { file: "Griffith Observatory skyline at sunset. (Unsplash).jpg", subject: "Griffith Observatory", author: "Kasper Bertelsen", license: "CC0" },
  cityHall: { file: "Los Angeles City Hall dllu.jpg", subject: "Los Angeles City Hall", author: "Daniel L. Lu", license: "CC BY-SA 4.0" },
  venice: { file: "Los Angeles - Venice Canal Historic District 05.jpg", subject: "Venice Canals", author: "Américo Toledano", license: "CC BY-SA 4.0" },
  watts: { file: "Watts Towers Arts Center pano.jpg", subject: "Watts Towers", author: "Bjlee2020", license: "CC BY-SA 4.0" },
  bridge: { file: "Ever Mach and Vincent Thomas Bridge.jpg", subject: "Vincent Thomas Bridge, San Pedro", author: "DanielMichaelPerry", license: "CC0" },
  ventura: { file: "Studio City's Ventura Boulevard Shopping District.JPG", subject: "Ventura Boulevard, Studio City", author: "Cbl62", license: "CC BY-SA 3.0" },
} satisfies Record<string, HeroImage>;

/** Neighborhood-specific matches first (by NC name), then by service region. */
export const HERO_BY_NC: [RegExp, HeroImage][] = [
  [/LOS FELIZ/i, HERO_IMAGES.griffith], [/VENICE/i, HERO_IMAGES.venice], [/WATTS/i, HERO_IMAGES.watts],
  [/SAN PEDRO|HARBOR|WILMINGTON/i, HERO_IMAGES.bridge], [/STUDIO CITY/i, HERO_IMAGES.ventura], [/DOWNTOWN|HISTORIC CULTURAL/i, HERO_IMAGES.cityHall],
];
export const HERO_BY_REGION: [RegExp, HeroImage][] = [
  [/VALLEY/i, HERO_IMAGES.ventura], [/HARBOR/i, HERO_IMAGES.bridge], [/SOUTH LA/i, HERO_IMAGES.watts],
  [/WEST LA/i, HERO_IMAGES.venice], [/EAST/i, HERO_IMAGES.griffith],
];

export function heroFor(ncName: string, region: string): HeroImage {
  return HERO_BY_NC.find(([r]) => r.test(ncName))?.[1] ?? HERO_BY_REGION.find(([r]) => r.test(region))?.[1] ?? HERO_IMAGES.cityHall;
}
export const heroSrc = (h: HeroImage) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(h.file)}?width=1600`;
export const heroPage = (h: HeroImage) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(h.file.replace(/ /g, "_"))}`;
