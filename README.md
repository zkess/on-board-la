# On Board LA

The purpose of this project is to create an "LA Onboarding" site for civic engagement focused on the City of Los Angeles. While there are many existing projects already, adding the local perspective is important. 

This project was initially built with [Lovable](https://lovable.dev).

It is now in the process of being fact-checked, cleaned, and made more aesthetically interesting. 

# Sources

---

Civic Boundaries & Government Open Data
* [Los Angeles Times Mapping L.A. Project (V6)](https://boundaries.latimes.com/)
   Used for:* Precise neighborhood names and polygon boundaries, distinguishing incorporated city segments from unincorporated Los Angeles County areas. Released under the MIT License by the L.A. Times Data and Graphics Department.
* [City of Los Angeles GeoHub (ArcGIS REST API)](https://geohub.lacity.org/)
   Layer 7:* City of Los Angeles Municipal Boundary (used to detect City of LA vs. neighboring municipalities).
   Layer 13:* Los Angeles City Council District boundaries and councilmember seats.
   Layer 18:* EmpowerLA Neighborhood Council boundaries, certification dates, and official URLs.
   Layer 22:* LA Sanitation (LASAN) trash and recycling collection schedules and routing.
* [Los Angeles County GIS Data Portal](https://egis-lacounty.hub.arcgis.com/)
   Layer 27:* Los Angeles County Board of Supervisors districts.
   Layer 29:* California Congressional districts covering Los Angeles.

---

Geocoding & Address Resolution
* [OpenStreetMap / Nominatim](https://nominatim.openstreetmap.org/)
   Used for:* Point geocoding of finalized address queries within the Los Angeles County bounding box, matching specific house numbers to civic coordinates. Data © OpenStreetMap contributors (ODbL).
* [Komoot Photon](https://photon.komoot.io/)
   Used for:* Fast, privacy-friendly address autofill and search suggestions without client-side tracking or API keys.

---

Hyperlocal News, Press & Radio
 Hyperlocal Publications: Hand-curated directory of community-focused outlets covering specific regions (e.g., The Eastsider LA, Larchmont Buzz, West LA Buzz, WeHo Times, Culver City Crossroads, San Pedro Today*).
 Public & Independent Radio: Broadcasters covering regional civic affairs, including LAist 89.3 (KPCC), KCRW 89.9, KNX News 97.1, KPFK 90.7 Pacifica Radio, and KJLH 102.3*.
 City Department Bulletins: Official subscription channels for LADWP, LAPD News, LAFD Alerts, and StreetsLA*.
 Community Forums: Verified neighborhood-specific Reddit communities (e.g., r/venice, r/losfeliz, r/echopark*).

---

Neighborhood History & Cultural Institutions
* Audited Neighborhood Facts (`src/data/neighborhood-facts.json`): 182 sourced local history facts spanning neighborhoods across Los Angeles. Each fact records its primary source attribution (historical societies, municipal records, Los Angeles Public Library historical archives, or Wikipedia citations verified to their original work).
* Neighborhood Institutions Directory (`src/data/neighborhood-institutions.json`): Curated directory of community cultural centers, parks, historic monuments, and independent gathering places across Greater Los Angeles.

---

Municipal Services & Newcomer Checklist
* [MyLA311](https://lacity.gov/myla311): City service request portal, bulky item pickups, and pothole/graffiti resolution.
* [NotifyLA](https://emergency.lacity.gov/notifyla): City of Los Angeles Emergency Management Department mass notification system.
* [211 LA County](https://211la.org/): Countywide health and human services referral directory.
* [LA Sanitation (LASAN)](https://www.lacitysan.org/): Curbside residential waste collection, organics/green bin composting guidelines, and Clean Harbors S.A.F.E. centers.
* [recycLA](https://www.lacitysan.org/recycla): Commercial and apartment building franchise waste program resources.
* [LADWP](https://www.ladwp.com/): Los Angeles Department of Water and Power service setups and drought/rebate programs.
* [Los Angeles Public Library (LAPL)](https://www.lapl.org/): Branch directories, digital library cards, and museum pass programs.
* [Metro TAP](https://www.taptogo.net/): Regional transit card system for LA Metro bus, subway, and light rail lines.
* [California Secretary of State](https://registertovote.ca.gov/): Voter registration and Los Angeles County Registrar-Recorder lookup.
* [California Department of Motor Vehicles (DMV)](https://www.dmv.ca.gov/): Driver's license and vehicle registration onboarding.
* [Ready LA / USGS ShakeAlert](https://www.usgs.gov/programs/earthquake-hazards/shakealert): Earthquake preparedness guidelines and regional hazard kits.

---

Photography & Media
* [Wikimedia Commons](https://commons.wikimedia.org/): Curated neighborhood photos documenting iconic architectural landmarks and public spaces, licensed under Creative Commons (CC BY, CC BY-SA) or dedicated to the Public Domain, with individual credits retained in the photo catalog.




