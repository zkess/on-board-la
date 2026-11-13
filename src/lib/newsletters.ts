import { regionKey } from "@/lib/region";
/** Newsletters researched Nov 2026. A newsletter matches when its `nc` regex hits the Neighborhood Council name, or its `region` regex hits the NC service region. */
export type Newsletter = { name: string; url: string; about: string; covers: string; nc?: RegExp; region?: RegExp };

export const HYPERLOCAL: Newsletter[] = [
  { name: "NoHo Nick", url: "https://nohonick.com/subscribe", about: "Weekly Valley news, food & events, Thursdays 9 AM", covers: "San Fernando Valley", region: /VALLEY/i },
  { name: "LA Daily News – Valley", url: "https://www.dailynews.com/local-news/", about: "Valley politics, schools and development", covers: "San Fernando Valley", region: /VALLEY/i },
  { name: "The Eastsider", url: "https://www.theeastsiderla.com", about: "Neighborhood council, development and small-business news", covers: "Echo Park, Silver Lake, Los Feliz, Atwater, Highland Park, Eagle Rock, Lincoln Heights, El Sereno", nc: /ECHO PARK|SILVER LAKE|LOS FELIZ|ATWATER|HISTORIC HIGHLAND|HIGHLAND PARK|EAGLE ROCK|LINCOLN HEIGHTS|LHNC|ARROYO SECO|GLASSELL|ELYSIAN|GREATER CYPRESS|EL SERENO|EMPOWERMENT CONGRESS|HERMON|EAST HOLLYWOOD/i, region: /EAST/i },
  { name: "The Eastside Rag", url: "https://eastsiderag.substack.com/", about: "Culture, pop-ups, neighbor chatter and personals", covers: "Silver Lake, Los Feliz, Atwater Village, Echo Park, Highland Park", nc: /SILVER LAKE|LOS FELIZ|ATWATER|ECHO PARK|HIGHLAND PARK|GREATER ECHO/i },
  { name: "The Voice of Los Feliz", url: "https://philleirness.substack.com/", about: "Local history, characters and happenings", covers: "Los Feliz, Franklin Hills", nc: /LOS FELIZ/i },
  { name: "Boyle Heights Beat", url: "https://localnewsforla.ac-page.com/BHB-newsletter-selection-signup", about: "Bilingual, youth-powered community news", covers: "Boyle Heights & the Eastside", nc: /BOYLE HEIGHTS|LINCOLN HEIGHTS|EL SERENO/i },
  { name: "Larchmont Buzz", url: "https://larchmontbuzz.com/", about: "Daily email on Greater Wilshire news & events", covers: "Larchmont, Hancock Park, Windsor Square, Greater Wilshire", nc: /GREATER WILSHIRE|MID CITY WEST|WILSHIRE CENTER|KOREATOWN|OLYMPIC PARK/i },
  { name: "Beverly Press", url: "https://beverlypress.com/", about: "Weekly local politics and Museum Row news", covers: "Miracle Mile, Fairfax, Beverly Grove, Hollywood", nc: /MID CITY WEST|HOLLYWOOD|GREATER WILSHIRE/i },
  { name: "LA Downtown News", url: "https://www.ladowntownnews.com/", about: "The weekly voice of Downtown", covers: "DTLA, Little Tokyo, Chinatown, Arts District", nc: /DOWNTOWN|ARTS DISTRICT|LITTLE TOKYO|HISTORIC CULTURAL|SKID ROW|CENTRAL CITY/i },
  { name: "DTLA Weekly", url: "https://dtlaweekly.com/", about: "Downtown arts, dining and real estate", covers: "Downtown LA", nc: /DOWNTOWN|ARTS DISTRICT|LITTLE TOKYO|HISTORIC CULTURAL|SKID ROW/i },
  { name: "The 9-to-5ish", url: "https://downtownla.com/9-5ish", about: "Monthly-ish guide for Downtown workers", covers: "Downtown LA", nc: /DOWNTOWN|HISTORIC CULTURAL/i },
  { name: "Westside Current", url: "https://www.westsidecurrent.com", about: "Investigative Westside reporting", covers: "Venice, Mar Vista, Del Rey, Brentwood, Palisades, Westwood", region: /WEST/i },
  { name: "The Argonaut", url: "https://argonautnews.com", about: "Coastal community news and arts", covers: "Venice, Mar Vista, Playa del Rey, Westchester", nc: /VENICE|MAR VISTA|DEL REY|WESTCHESTER|PALMS/i },
  { name: "The Sunny Sheet: Brentwood", url: "https://thesunnysheet.substack.com/", about: "Notes and gems from Brentwood", covers: "Brentwood", nc: /BRENTWOOD|PACIFIC PALISADES/i },
  { name: "LA Sentinel", url: "https://lasentinel.net", about: "Historic Black press: civic affairs and culture", covers: "Crenshaw, Leimert Park, Baldwin Hills, South LA", region: /SOUTH/i },
  { name: "San Pedro Today", url: "https://sanpedrotoday.com/", about: "San Pedro's town paper", covers: "San Pedro & the waterfront", nc: /SAN PEDRO|CENTRAL SAN PEDRO|COASTAL SAN PEDRO/i },
  { name: "Random Lengths News", url: "https://www.randomlengthsnews.com", about: "Port, labor and harbor community news", covers: "San Pedro, Wilmington, Harbor City, Harbor Gateway", region: /HARBOR/i },
];

export const CITYWIDE: Newsletter[] = [
  { name: "Crosstown", url: "https://xtown.la", about: "Neighborhood-level data on crime, traffic, 311", covers: "Every LA neighborhood" },
  { name: "LAist", url: "https://laist.com/newsletters", about: "Public-radio newsroom daily briefing", covers: "Citywide" },
  { name: "L.A. Taco", url: "https://lataco.com", about: "Street-level food, culture and news", covers: "Citywide" },
  { name: "Streetsblog LA", url: "https://la.streetsblog.org", about: "Transit, biking and walking", covers: "Citywide" },
];

export const CITY_DEPARTMENTS: Newsletter[] = [
  { name: "Mayor's Office", url: "https://mayor.lacity.gov/GetUpdates", about: "Citywide updates & ways to get involved", covers: "Citywide" },
  { name: "EmpowerLA", url: "https://neighborhoodempowerment.lacity.gov/", about: "Neighborhood Council news & elections", covers: "Citywide" },
  { name: "LA Public Library", url: "https://www.lapl.org/newsletter", about: "Branch events, free digital perks", covers: "Citywide" },
  { name: "Emergency Management", url: "https://emergency.lacity.gov/newsletters", about: "Monthly disaster-preparedness tips", covers: "Citywide" },
  { name: "LA Housing Dept", url: "https://housing.lacity.gov/about-us/subscribe-to-newsletters", about: "Tenant rights, rent relief, landlord rules", covers: "Citywide" },
  { name: "City Planning", url: "https://planning.lacity.gov/plans-policies", about: "Community plan & zoning updates", covers: "Citywide" },
  { name: "LADOT", url: "https://ladot.lacity.gov/", about: "Street safety, bike lanes, transit projects", covers: "Citywide" },
  { name: "Wages LA", url: "https://wagesla.lacity.gov/subscribe-our-newsletter", about: "Minimum wage & worker protections", covers: "Citywide" },
];

export function hyperlocalFor(ncName: string, region: string): Newsletter[] {
  return HYPERLOCAL.filter((n) => (n.nc && n.nc.test(ncName)) || (n.region && n.region.test(regionKey(region))));
}
