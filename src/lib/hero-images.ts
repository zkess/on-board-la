/** Header photos from Wikimedia Commons. Each carries its author + license so it can be credited on screen. */
export type HeroImage = { file: string; subject: string; author: string; license: string };

export const HERO_IMAGES = {
  griffith: { file: "Griffith Observatory skyline at sunset. (Unsplash).jpg", subject: "Griffith Observatory", author: "Kasper Bertelsen", license: "CC0" },
  cityHall: { file: "Los Angeles City Hall dllu.jpg", subject: "Los Angeles City Hall", author: "Daniel L. Lu", license: "CC BY-SA 4.0" },
  venice: { file: "Los Angeles - Venice Canal Historic District 05.jpg", subject: "Venice Canals", author: "Américo Toledano", license: "CC BY-SA 4.0" },
  watts: { file: "Watts Towers Arts Center pano.jpg", subject: "Watts Towers", author: "Bjlee2020", license: "CC BY-SA 4.0" },
  bridge: { file: "Ever Mach and Vincent Thomas Bridge.jpg", subject: "Vincent Thomas Bridge, San Pedro", author: "DanielMichaelPerry", license: "CC0" },
  ventura: { file: "Studio City's Ventura Boulevard Shopping District.JPG", subject: "Ventura Boulevard, Studio City", author: "Cbl62", license: "CC BY-SA 3.0" },
  angelinoHeights: { file: "Angelino Heights Victorian.jpg", subject: "Victorian house, Angelino Heights", author: "Konrad Summers from Santa Clarita (Valencia), California, USA", license: "CC BY-SA 2.0" },
  unionStation: { file: "Los Angeles (California, USA), Union Station -- 2012 -- 4938.jpg", subject: "Union Station", author: "Dietmar Rabich", license: "CC BY-SA 4.0" },
  leimert: { file: "Leimert Plaza Park 2026 March 02.jpg", subject: "Leimert Plaza Park", author: "Jengod", license: "CC BY-SA 4.0" },
  olvera: { file: "Olvera Street P1000569.jpg", subject: "Olvera Street", author: "NewtonCourt", license: "CC BY-SA 4.0" },
  echopark: { file: "Echo_Park_Lake_Fountain.jpg", subject: "Echo Park Fountain", author: "By Accord14 - Own work", license: "CC BY-SA 4.0" },
  wilmington: {file: "Drum_Barracks,_Wilmington,_California.jpg", subject: "Drum Barracks", author: "By Los Angeles", license: "CC BY-SA 3.0"}, artsdistrict: { file: "Art District in Los Angeles 2.jpg", subject: "Arts District Mural", author: "Johnnydeezwax", license: "CC BY-SA 3.0"},boyleheights: { file: "Boyle Heights Sign.jpg", subject: "Boyle Heights Sign", author: "MiztuhX", license: "CC BY-SA 4.0"},chinatown: { file: "Los Angeles China town 1.jpg", subject: "Chinatown", author: "Curlyrnd", license: "CC BY-SA 4.0"},civiccenter: { file: "Grand Park Los Angeles view toward City Hall.jpg", subject: "Grand Park", author: "PKM", license: "CC BY-SA 3.0"},downtown: { file: "Los Angeles Central Library 02.jpg", subject: "LA Central Library", author: "Visitor7", license: "CC BY-SA 3.0"},
} satisfies Record<string, HeroImage>;

/** Famous spots from the home page get their own landmark photo, matched by the searched text. */
export const HERO_BY_LANDMARK: [RegExp, HeroImage][] = [
  [/GRIFFITH OBSERVATORY/i, HERO_IMAGES.griffith], [/VENICE CANALS?/i, HERO_IMAGES.venice], [/WATTS TOWERS/i, HERO_IMAGES.watts],
  [/UNION STATION/i, HERO_IMAGES.unionStation], [/LEIMERT PARK/i, HERO_IMAGES.leimert], [/OLVERA/i, HERO_IMAGES.olvera],
];
export const landmarkHero = (query: string): HeroImage | undefined => HERO_BY_LANDMARK.find(([r]) => r.test(query))?.[1];

/** Neighborhood-specific matches first (by NC name), then by service region. */
export const HERO_BY_NC: [RegExp, HeroImage][] = [
  [/ECHO PARK/i, HERO_IMAGES.echopark], [/ANGELINO HEIGHTS/i, HERO_IMAGES.angelinoHeights], [/LOS FELIZ/i, HERO_IMAGES.griffith], [/VENICE/i, HERO_IMAGES.venice], [/WATTS/i, HERO_IMAGES.watts],
  [/SAN PEDRO|HARBOR/i, HERO_IMAGES.bridge], [/WILMINGTON/i, HERO_IMAGES.wilmington],[/STUDIO CITY/i, HERO_IMAGES.ventura], [/DOWNTOWN|HISTORIC CULTURAL/i, HERO_IMAGES.cityHall],
[/ARTS DISTRICT/i, HERO_IMAGES.artsdistrict],[/BOYLE HEIGHTS/i, HERO_IMAGES.boyleheights],[/CHINATOWN/i, HERO_IMAGES.chinatown],[/CIVIC CENTER/i, HERO_IMAGES.civiccenter],[/DOWNTOWN/i, HERO_IMAGES.downtown],
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
