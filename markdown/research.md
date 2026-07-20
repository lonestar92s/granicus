# Research — Local Parks v1

Two tracks: (1) feasible real data sources, (2) published user research to inform persona and brief.

Goal: get residents outside into local parks — with a prototype feasible in ~90 minutes.

## Recommendation (shortlist)

| Rank | Source | Best for | Auth | Fit for “local parks” |
|------|--------|----------|------|------------------------|
| 1 | **Chicago Open Data — CPD_Parks** | Amenity-rich neighborhood parks | None | Excellent |
| 2 | **City ArcGIS (e.g. Austin)** | Clean GeoJSON map layer | None | Strong |
| 3 | **OpenStreetMap Overpass** | Any city, no portal lock-in | None | Strong (variable quality) |
| 4 | **NPS Data API** | National parks only | Free key | Weak for “local” |
| 5 | **RIDB / Recreation.gov** | Federal facilities & camping | Free key | Weak for city parks |

**Strongest default for this take-home:** Chicago `CPD_Parks` (`ejsh-fztr`) — official municipal data, no API key, lat/long polygons, and dozens of amenity fields (playground, basketball, beach, dog park, tennis, pools, etc.) that support filter/browse UX without inventing data.

---

## 1. Chicago Park District — CPD_Parks (recommended)

- **Portal:** https://data.cityofchicago.org/Parks-Recreation/CPD_Parks/ejsh-fztr  
- **API (SODA / Socrata):** `https://data.cityofchicago.org/resource/ejsh-fztr.json`  
- **Auth:** none required for light use (app token optional for higher limits)  
- **License:** City of Chicago open data (public)

### Why it fits

- Literally **local** parks (neighborhood / community), not national destinations  
- One row ≈ one park, with address, zip, acres, ward  
- Amenity columns are mostly numeric counts (`playground`, `basketball`, `beach`, `dog_friend`, `tennis_cou`, `pool_outdo`, …) — easy filters: “parks with a playground near me”  
- Geometry available as GeoJSON-style multipolygon for maps

### Example calls

```http
GET https://data.cityofchicago.org/resource/ejsh-fztr.json?$select=park,location,acres,zip,playground,basketball,beach,dog_friend&$limit=50
```

```http
GET https://data.cityofchicago.org/resource/ejsh-fztr.json?$where=playground > 0&$limit=20
```

### Sample fields (verified)

`park`, `park_no`, `location`, `zip`, `acres`, `ward`, `park_class`, plus amenity counts such as `playground`, `basketball`, `beach`, `dog_friend`, `tennis_cou`, `pool_outdo`, `gymnasium`, `skate_park`, …

### Related Chicago datasets (optional enrichment)

- **Chicago Park District Activities** — `tn7v-6rnw` (programs/events; good if v1 includes “what’s happening”)  
- Older “Facilities (current)” listing (`5yyk-qt9y`) returned empty in sampling — prefer `ejsh-fztr`

### Tradeoffs

- City-specific (you pick Chicago as the invented product city — fine per prompt)  
- Amenity field names are truncated (`tennis_cou`, `dog_friend`) — need a small label map in the UI  
- Full geometry responses are large; select fields or drop `the_geom` when not mapping polygons

---

## 2. Municipal ArcGIS FeatureServer (e.g. Austin)

- **Example layer:** City of Austin Parks  
  `https://maps.austintexas.gov/arcgis/rest/services/Shared/Infrastructure_2/MapServer/0/query`  
- **Auth:** none  
- **Verified:** ~371 parks; returns name, park type, zip, open/closed status + polygon geometry

### Example call

```http
GET .../MapServer/0/query?where=1=1&outFields=LOCATION_NAME,PARK_TYPE,ZIPCODE,ASSET_STATUS&outSR=4326&f=geojson&resultRecordCount=50
```

### Why consider it

- Clean map-first data; GeoJSON out of the box  
- Good if the prototype is “map of parks near me” rather than amenity filters  

### Tradeoffs

- Attributes thinner than Chicago (often name / type / status only)  
- Amenities usually need a second layer or OSM  

Similar pattern exists for Portland, Denver, Minneapolis, SF, etc. via ArcGIS Hub / open data.

---

## 3. OpenStreetMap via Overpass API

- **Endpoint:** `https://overpass-api.de/api/interpreter`  
- **Auth:** none (be polite: User-Agent, cache results, don’t hammer)  
- **Tag:** `leisure=park` (also `leisure=playground`, `leisure=nature_reserve` as needed)

### Example query (bbox)

```
[out:json][timeout:25];
(
  node["leisure"="park"](30.25,-97.76,30.30,-97.72);
  way["leisure"="park"](30.25,-97.76,30.30,-97.72);
);
out center tags;
```

### Sample tags (verified, Austin)

`name`, `leisure=park`, `operator`, address tags, sometimes `playground`, `sport`, opening hours — **coverage varies by city**.

### Why consider it

- Works for **any** city without finding a portal  
- Great for map + list prototypes  

### Tradeoffs

- Incomplete / inconsistent amenities vs official park-district data  
- Overpass QL learning curve; public instances can be slow or rate-limit  
- Best practice for demos: fetch once at build time → ship a static JSON snapshot

---

## 4. National Park Service (NPS) Data API

- **Docs:** https://www.nps.gov/subjects/developer/  
- **Base:** `https://developer.nps.gov/api/v1`  
- **Auth:** free API key (`api_key` query param)  
- **Endpoints:** `/parks`, `/alerts`, `/campgrounds`, `/thingstodo`, `/visitorcenters`, …

### Why / why not

- Polished content: descriptions, images, fees, hours  
- **Misaligned** with “local parks” — national units, not neighborhood greenspace  
- Use only if you deliberately reframe the product as regional/national trip planning

---

## 5. RIDB / Recreation.gov

- **Docs:** https://ridb.recreation.gov/docs  
- **Base:** `https://ridb.recreation.gov/api/v1`  
- **Auth:** free API key (`apikey` header or query)  
- **Endpoints:** `/facilities`, `/recareas`, `/activities`, `/campsites`, `/events`, …

### Why / why not

- Excellent for federal recreation (campgrounds, trails, reservations)  
- Same gap as NPS: not city neighborhood parks  
- Heavier schema; more than you need for a 90-minute local-parks v1

---

## Decision guide

| If you want… | Pick… |
|--------------|--------|
| Amenity filters + map for a real city, minimal glue | **Chicago CPD_Parks** |
| Beautiful map polygons, any mid-size city with ArcGIS | **Austin (or similar) ArcGIS** |
| City-agnostic / “works anywhere” story | **OSM Overpass** (+ optional static snapshot) |
| Nature trip / camping product | NPS or RIDB |

## Data decision (locked)

**Primary source: Chicago CPD_Parks** — see `plan.md` for endpoints, schema, and API docs.

---

# User research — who goes to parks, and what gets in the way

Used to sharpen persona and problem statement for `brief.md`. Sources are national surveys plus Chicago/metro studies (we do not have a proprietary resident interview set for this take-home).

## Key takeaway for the product brief

Chicago already has **excellent geographic park access** (~98% of residents near a park per Trust for Public Land / Park District reporting). The digital opportunity is less “find *a* park that exists” and more:

1. **Awareness** — people don’t know locations *or what’s offered*  
2. **Interest match** — offerings don’t match what they want today  
3. **Time** — discovery has to be fast enough for a short outing  

Safety, fees, and “having someone to go with” are real barriers but are weaker fits for a 90-minute discovery prototype.

---

## National: NRPA Engagement with Parks

**What it is:** Annual survey of U.S. adults on use of local parks and recreation (NRPA / Wakefield). Multi-year series; lack of time has been the top barrier for years.

**Sources:**

- 2025 Engagement With Parks Report: https://www.nrpa.org/contentassets/257fe28053c6420786927fcffc2f9996/2025engagementreport_final.pdf  
- 2024 report: https://www.nrpa.org/contentassets/257fe28053c6420786927fcffc2f9996/2024nrpaengagementreport.pdf  
- Barriers blog summary: https://www.nrpa.org/blog/what-keeps-people-from-visiting-their-local-parks/  
- Older detailed barriers writeup: https://www.nrpa.org/globalassets/research/engagement-survey-report.pdf  

**Barriers (approximate; wording varies slightly by year):**

| Barrier | Approx. share | Relevance to a digital discovery v1 |
|---------|---------------|-------------------------------------|
| Lack of time | ~39–41% (often #1) | High — reduce decision friction; “near me + matches need, fast” |
| Lack of quality facilities near home | ~20% | Medium — surface better-matching parks within reach |
| Concern about personal safety (at park / travel) | ~17–21% | Low for v1 — ops/infra; don’t overclaim |
| Unaware of park location or offerings | ~16% (Millennials ~23%) | **High — strongest digital opportunity** |
| Offerings don’t match interests | ~14% | High — amenity / activity filters |
| Excessive costs / fees | ~14–17% | Medium — free visits vs paid programs; heavier if registration |

**Implication:** A product that helps time-pressed residents *quickly* find a nearby park that matches an activity (playground, dog, basketball, etc.) directly addresses awareness + interest-match + time. It does not “solve” safety or companionship.

---

## National: Trust for Public Land outdoor spaces polling (2026)

**What it is:** YouGov survey (n≈4,000 weighted U.S. adults) on local parks and outdoor public spaces, commissioned by TPL.

**Source:** https://www.tpl.org/wp-content/uploads/2026/05/TPL-Outdoor-Public-Spaces-Polling-Memo-vF.pdf  

**Findings useful for persona:**

- Local parks/green spaces are heavily used (exercise, “third place” gathering).  
- Many adults want to spend *more* time outdoors.  
- Among those who want more outdoor time, top motivator was **having somebody to go with (~46%)** — especially salient for younger adults and people reporting anxiety/depression history.  
- Improving park quality and safer routes also ranked high.

**Implication:** Social motivation is real. V1 shouldn’t pretend to be a social network, but messaging/filters for “kids / dog / casual sport” can still lower the “go alone” barrier by giving a concrete outing purpose.

---

## Chicago-specific signals

### Park access vs. activation

- Chicago ranks highly on Trust for Public Land park access / equity metrics (Park District: only city over 1M in TPL top 10 in 2024; ~98% of population within walking distance of a park cited in budget materials).  
- **Problem framing for Chicago:** not “no parks nearby,” but under-use relative to access — discovery, programming fit, communication, and quality/activation.

### Chicago Park District 2025–2030 Strategic Plan engagement

**What it is:** Ten-month community engagement (~Dec 2023–2024) feeding the new strategic plan: 10,000+ survey responses, town halls, community meetings, teen/senior focus groups, stakeholder roundtables.

**Sources:**

- Strategic plan overview: https://www.chicagoparkdistrict.com/strategic-plan  
- Plan launch news: https://www.chicagoparkdistrict.com/about-us/news/park-district-superintendent-releases-new-five-year-strategic-plan-building-inclusive  
- Decennial efficiency report (summarizes engagement + follow-ups): https://assets.chicagoparkdistrict.com/s3fs-public/documents/about%20us/BOC/The%20Chicago%20Park%20District%20Decennial%20Committee%20Efficiency%20Report.pdf  

**Themes visible in public materials (full crosstabs not published):**

- Strengthen **communication** so residents know about events, opportunities, and services (new website, exploring texting, etc.).  
- Expand park user base through neighborhood programming.  
- Teens: **lack of awareness → lack of participation**.  
- Interest in more adult/senior offerings, hours, accessibility / ADA.  
- Mission/vision emphasize wellness, inclusion, connecting communities through recreation.

**Implication:** District itself is prioritizing awareness and reach — aligns with a resident discovery product.

### UIC Prevention Research Center — Chicago PAC needs assessment (2019)

**What it is:** Semi-structured interviews (n=55) with Park Advisory Council members, community members, and park supervisors across renovated Chicago parks.

**Source:** https://p3rc.uic.edu/wp-content/uploads/sites/561/2019/11/ParksBrief_508.pdf  

**Findings:**

- Safety/crime concerns are common among PAC members and supervisors; linked to avoidance when areas feel unsafe.  
- Programming often feels skewed to young kids or older adults; gap for teens / younger adults.  
- Marketing still heavily **flyers + word of mouth**; opportunity for stronger digital / social promotion.  
- Individual community members less involved in shaping programs than PAC members.

**Implication:** Digital discovery of parks *and* (later) programs fills a gap supervisors already recognize; safety remains a real non-digital barrier.

---

## Other U.S. metro research (pattern confirmation)

### NYC Community Parks Initiative / PARCS

Renovating under-resourced neighborhood parks (play equipment, sports, seating, shade, accessibility) was associated with **increased park use**, especially among adults; residents cite nature/connection as motivators; quality + activation matter as much as park existence.

- CUNY SPH summary: https://sph.cuny.edu/life-at-sph/news/2024/04/16/318m-nyc-community-parks-initiative-is-associated-with-increased-use-of-urban-parks-in-low-income-neighborhoods/  
- Park use patterns / satisfaction (PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC12217957/  

### Mobility / distance research

Park visitation drops with distance (exponential decay across U.S. metros). “Near me” is not optional UX. Amenities such as playgrounds and water features often correlate with visits more than some sports facilities (study-dependent).

- Example: multi-metro distance decay analysis (Landscape & Urban Planning, 2026): https://doi.org/10.1016/j.landurbplan.2026.105690  

---

## Persona implications (synthesis)

| Persona angle | Supported by research? | Good v1 primary? |
|---------------|------------------------|------------------|
| Time-pressed adults seeking a short outdoor outing | NRPA time + awareness + interest-match | **Yes** |
| Parents / caregivers needing a playground nearby | Amenity-driven use; NYC/playground signals | **Yes** (subset of above) |
| Dog owners / casual sports | Interest-match; amenity filters | Yes as filter facets |
| Teens (awareness gap) | Chicago strategic plan | Possible, but harder UX + content |
| Safety-anxious residents | NRPA + UIC | No — app can’t fix root cause |
| People who need a companion to go | TPL ~46% motivator | Weak as sole persona |
| Program shoppers (camps, classes, fees) | NRPA fees; CPD Activities data | Stretch for 90-min v1 |

### Recommended primary persona (from this research)

**Chicago adults (especially ~25–44) deciding on a short outdoor outing today** — walk, kids, dog, or casual sport — who don’t know which nearby park fits their need. Success for them: find a matching park in minutes and leave with a clear next step (map / directions).

### Success metrics framing

- **North Star (city):** increase park visits / participation over time (e.g., District program enrollment already cited as rising in budget materials).  
- **v1 proxies (product):** filter use → park detail views → “Get directions” / intent taps.  
- Do not claim the prototype measures real foot traffic.

---

## Caveats

- Chicago’s 10,000+ strategic-plan survey responses are summarized publicly, not released as full open datasets.  
- NRPA figures are national, not Chicago-only.  
- This is secondary research for a take-home — enough to justify persona and problem, not a substitute for primary discovery interviews.
