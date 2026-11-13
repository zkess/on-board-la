/** Header photos from Wikimedia Commons. Each carries its author + license so it can be credited on screen. */
export type HeroImage = { file: string; subject: string; author: string; license: string };

const IMG = {
  griffith: { file: "Griffith Observatory skyline at sunset. (Unsplash).jpg", subject: "Griffith Observatory", author: "Kasper Bertelsen", license: "CC0" },
  cityHall: { file: "Los Angeles City Hall dllu.jpg", subject: "Los Angeles City Hall", author: "Daniel L. Lu", license: "CC BY-SA 4.0" },
  venice: { file: "Los Angeles - Venice Canal Historic District 05.jpg", subject: "Venice Canals", author: "Américo Toledano", license: "CC BY-SA 4.0" },
  watts: { file: "Watts Towers Arts Center pano.jpg", subject: "Watts Towers", author: "Bjlee2020", license: "CC BY-SA 4.0" },
  bridge: { file: "Ever Mach and Vincent Thomas Bridge.jpg", subject: "Vincent Thomas Bridge, San Pedro", author: "DanielMichaelPerry", license: "CC0" },
  ventura: { file: "Studio City's Ventura Boulevard Shopping District.JPG", subject: "Ventura Boulevard, Studio City", author: "Cbl62", license: "CC BY-SA 3.0" },
} satisfies Record<string, HeroImage>;

/** Neighborhood-specific matches first (by NC name), then by service region. */
const BY_NC: [RegExp, HeroImage][] = [
  [/LOS FELIZ/i, IMG.griffith], [/VENICE/i, IMG.venice], [/WATTS/i, IMG.watts],
  [/SAN PEDRO|HARBOR|WILMINGTON/i, IMG.bridge], [/STUDIO CITY/i, IMG.ventura], [/DOWNTOWN|HISTORIC CULTURAL/i, IMG.cityHall],
];
const BY_REGION: [RegExp, HeroImage][] = [
  [/VALLEY/i, IMG.ventura], [/HARBOR/i, IMG.bridge], [/SOUTH LA/i, IMG.watts],
  [/WEST LA/i, IMG.venice], [/EAST/i, IMG.griffith],
];

export function heroFor(ncName: string, region: string): HeroImage {
  return BY_NC.find(([r]) => r.test(ncName))?.[1] ?? BY_REGION.find(([r]) => r.test(region))?.[1] ?? IMG.cityHall;
}
export const heroSrc = (h: HeroImage) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(h.file)}?width=1600`;
export const heroPage = (h: HeroImage) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(h.file.replace(/ /g, "_"))}`;
