export const LANDMARKS = [
  { name: "Griffith Observatory", q: "Griffith Observatory, Los Angeles", blurb: "Los Feliz · hilltop stargazing" },
  { name: "Venice Canals", q: "Venice Canals, Los Angeles", blurb: "Venice · Abbot Kinney's waterways" },
  { name: "Watts Towers", q: "Watts Towers, 1761 East 107th Street, Los Angeles", blurb: "Watts · Simon Rodia's masterpiece" },
  { name: "Union Station", q: "Union Station, 800 North Alameda Street, Los Angeles", blurb: "Downtown · the last great train station" },
  { name: "Leimert Park", q: "Leimert Park Village, Los Angeles", blurb: "Crenshaw · Black arts & culture hub" },
  { name: "Olvera Street", q: "Olvera Street, Los Angeles", blurb: "El Pueblo · birthplace of LA" },
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

export type ChecklistItem = { id: string; text: string; link?: string };
export const CHECKLIST: { phase: string; subtitle: string; items: ChecklistItem[] }[] = [
  { phase: "Day 1", subtitle: "Get safe and informed", items: [
    { id: "notifyla", text: "Sign up for NotifyLA emergency alerts", link: "https://emergency.lacity.gov/notifyla" },
    { id: "311", text: "Download MyLA311 and save 3-1-1 in your phone", link: "https://myla311.lacity.gov" },
    { id: "trash", text: "Find your trash day (see your dashboard)" },
    { id: "sweep", text: "Look up your street sweeping schedule", link: "https://ladotlivestreetsweeping.lacity.org" },
  ]},
  { phase: "Week 1", subtitle: "Plug into your neighborhood", items: [
    { id: "vote", text: "Register to vote at your new address", link: "https://registertovote.ca.gov" },
    { id: "lapl", text: "Get a free LA Public Library card", link: "https://www.lapl.org/new-card" },
    { id: "tap", text: "Get a TAP card for Metro", link: "https://www.taptogo.net" },
    { id: "news", text: "Subscribe to one citywide and one hyperlocal newsletter" },
    { id: "cd", text: "Follow your Councilmember's newsletter" },
  ]},
  { phase: "Month 1", subtitle: "Show up", items: [
    { id: "nc", text: "Attend a Neighborhood Council meeting" },
    { id: "dmv", text: "Update your driver's license address", link: "https://www.dmv.ca.gov/portal/dmv-virtual-office/change-of-address/" },
    { id: "council", text: "Watch or attend a City Council meeting", link: "https://clerk.lacity.gov/calendar" },
    { id: "ready", text: "Build an earthquake kit (ReadyLA)", link: "https://emergency.lacity.gov/readyla" },
    { id: "neighbor", text: "Introduce yourself to a neighbor" },
  ]},
];
