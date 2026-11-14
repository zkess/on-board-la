export const LANDMARKS = [
  { name: "Griffith Observatory", q: "Griffith Observatory, Los Angeles", blurb: "Los Feliz · Art Deco stargazing" },
  { name: "Venice Canals", q: "Venice Canals, Los Angeles", blurb: "Venice · Urban oasis" },
  { name: "Watts Towers", q: "Watts Towers, 1761 East 107th Street, Los Angeles", blurb: "Watts · Folk art masterpiece" },
  { name: "Union Station", q: "Union Station, 800 North Alameda Street, Los Angeles", blurb: "Downtown · Iconic arrival" },
  { name: "Leimert Park", q: "Leimert Park Village, Los Angeles", blurb: "Crenshaw · Black arts & culture" },
  { name: "Olvera Street", q: "Olvera Street, Los Angeles", blurb: "El Pueblo · Birthplace of LA" },
];

export const INDEPENDENT_CITIES: Record<string, string> = {
  "West Hollywood": "https://www.weho.org",
  "Santa Monica": "https://www.santamonica.gov",
  "Beverly Hills": "https://www.beverlyhills.org",
  "Culver City": "https://www.culvercity.org",
  "Burbank": "https://www.burbankca.gov",
  "Glendale": "https://www.glendaleca.gov",
  "Pasadena": "https://www.cityofpasadena.net",
  "Inglewood": "https://www.cityofinglewood.org",
  "Long Beach": "https://www.longbeach.gov",
  "San Fernando": "https://ci.san-fernando.ca.us",
  "Malibu": "https://www.malibucity.org",
};

export const APPS = [
  { name: "MyLA311", what: "Report potholes, graffiti, bulky-item pickup", url: "https://myla311.lacity.gov" },
  { name: "211 LA", what: "Food, housing & healthcare referrals · Call 2-1-1", url: "https://211la.org/needhelp" },
  { name: "NotifyLA", what: "Official emergency alerts for the City", url: "https://emergency.lacity.gov/notifyla" },
  { name: "Metro TAP", what: "Load fare & ride bus and rail", url: "https://www.taptogo.net" },
  { name: "LA Public Library", what: "Free card: books, museum passes, Kanopy", url: "https://www.lapl.org/apps" },
  { name: "ShakeAlertLA", what: "Earthquake early warning", url: "https://www.myshake.berkeley.edu" },
  { name: "LADOT Parking", what: "Pay meters from your phone", url: "https://ladotparking.org" },
];

export const CIVIC_POIS = [
  { name: "LA City Hall", kind: "Government", lat: 34.0537, lng: -118.2427 },
  { name: "Central Library", kind: "Library", lat: 34.0503, lng: -118.2546 },
  { name: "Grand Park", kind: "Public space", lat: 34.0559, lng: -118.2468 },
  { name: "Van Nuys Civic Center", kind: "Government", lat: 34.1849, lng: -118.4487 },
  { name: "West LA Municipal Bldg", kind: "Government", lat: 34.0418, lng: -118.4448 },
  { name: "San Pedro Municipal Bldg", kind: "Government", lat: 33.7377, lng: -118.2794 },
  { name: "Watts Labor Community Action Committee", kind: "Community", lat: 33.9426, lng: -118.2398 },
  { name: "Griffith Park Ranger Station", kind: "Parks", lat: 34.1366, lng: -118.2849 },
  { name: "Mark Taper Auditorium (LAPL)", kind: "Library", lat: 34.0505, lng: -118.2548 },
  { name: "LA County Registrar (voting)", kind: "Elections", lat: 33.9172, lng: -118.1156 },
];

export type ChecklistItem = { id: string; text: string; tag: "Safety" | "Utilities" | "Streets" | "Transit" | "Civic" | "Legal" | "Perks" | "Community"; tip?: string; link?: string };
export const CHECKLIST: { phase: string; subtitle: string; items: ChecklistItem[] }[] = [
  { phase: "Day 1", subtitle: "Get safe and settled", items: [
    { id: "notifyla", tag: "Safety", text: "Sign up for NotifyLA emergency alerts", tip: "The City's official texts for fires, evacuations and other emergencies.", link: "https://emergency.lacity.gov/notifyla" },
    { id: "myshake", tag: "Safety", text: "Install the MyShake earthquake warning app", tip: "California's early warning can give you seconds to drop, cover and hold on.", link: "https://myshake.berkeley.edu" },
    { id: "311", tag: "Civic", text: "Download MyLA311 and save 3-1-1 in your phone", tip: "Use it for potholes, graffiti, dumped items and free bulky pickups.", link: "https://myla311.lacity.gov" },
    { id: "ladwp", tag: "Utilities", text: "Start or transfer water and power with LADWP", tip: "The City runs its own utility, so most LA addresses don't use Edison.", link: "https://www.ladwp.com/residential-services/start-stop-move-service" },
    { id: "sweep", tag: "Streets", text: "Check your block's street sweeping and parking signs", tip: "Sweeping tickets are one of the most common surprises for newcomers.", link: "https://ladotlivestreetsweeping.lacity.org" },
    { id: "water", tag: "Safety", text: "Store emergency water", tip: "Plan for at least one gallon per person and pet per day.", link: "https://www.ready.gov/water" },
  ]},
  { phase: "Week 1", subtitle: "Plug into your neighborhood", items: [
    { id: "vote", tag: "Civic", text: "Register to vote at your new address", tip: "You need to update it every time you move.", link: "https://registertovote.ca.gov" },
    { id: "lapl", tag: "Perks", text: "Get a free LA Public Library card", tip: "Unlocks free museum passes, e-books, movies and more.", link: "https://www.lapl.org/new-card" },
    { id: "tap", tag: "Transit", text: "Add a TAP card to your phone wallet", tip: "Works on Metro buses and trains, plus many local bus lines.", link: "https://www.taptogo.net" },
    { id: "cd", tag: "Civic", text: "Subscribe to your Councilmember's newsletter", tip: "The best way to hear about local projects and community meetings." },
    { id: "compost", tag: "Streets", text: "Learn the green bin food scrap rules", tip: "Food scraps go in the green bin with yard trimmings.", link: "https://sanitation.lacity.gov/san/faces/home/portal/s-lsh-wwd/s-lsh-wwd-s/s-lsh-wwd-s-r/s-lsh-wwd-s-r-fwr" },
    { id: "news", tag: "Community", text: "Follow one neighborhood news source", tip: "Try a hyperlocal newsletter or your neighborhood subreddit." },
  ]},
  { phase: "Month 1", subtitle: "Make it official and show up", items: [
    { id: "dmv", tag: "Legal", text: "Update your driver's license address", tip: "California asks you to report a move within 10 days.", link: "https://www.dmv.ca.gov/portal/dmv-virtual-office/change-of-address/" },
    { id: "car", tag: "Legal", text: "Register an out-of-state car in California", tip: "New residents have 20 days after moving here.", link: "https://www.dmv.ca.gov/portal/vehicle-registration/new-registration/" },
    { id: "nc", tag: "Civic", text: "Attend a Neighborhood Council meeting", tip: "Find the date on your dashboard. Anyone who lives here can speak." },
    { id: "council", tag: "Civic", text: "Watch or attend a City Council meeting", link: "https://clerk.lacity.gov/calendar" },
    { id: "ready", tag: "Safety", text: "Build an earthquake go-bag", tip: "Pack food, water, a flashlight, first aid and copies of key documents.", link: "https://emergency.lacity.gov/readyla" },
    { id: "neighbor", tag: "Community", text: "Swap numbers with a neighbor", tip: "Neighbors are often the first help after a disaster." },
  ]},
];

/** Citywide local news radio — same for every LA address. */
export const RADIO = [
  { name: "LAist 89.3 FM (KPCC)", url: "https://laist.com/radio", about: "Public radio: local news, AirTalk, Morning Edition" },
  { name: "KCRW 89.9 FM", url: "https://www.kcrw.com", about: "Public radio: Greater LA, Press Play, NPR news" },
  { name: "KNX News 97.1 FM", url: "https://www.audacy.com/knxnews", about: "All-news: traffic, weather and breaking news around the clock" },
  { name: "KPFK 90.7 FM", url: "https://www.kpfk.org", about: "Listener-supported community and public-affairs programming" },
  { name: "KJLH 102.3 FM", url: "https://www.kjlhradio.com", about: "Community radio serving South LA since 1965" },
];
