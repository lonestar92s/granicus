# Plan — Local Parks v1

Companion to `brief.md` and `research.md`. Open decisions live in `open-questions.md` — resolve those before / during Phase 0.

---

## Product decisions (locked)

Resolved from `open-questions.md`.

| Decision | Choice |
|----------|--------|
| Product name | **ChicaGO Outside** |
| Platform | **Mobile web** (Vite + React; mobile viewport primary) |
| Primary use case | **Discover parks by preference — filtering first** |
| Outcome | Find a suitable park → park detail → **Get directions** (intent) |
| Location | **ZIP only** — hardcoded default ZIP + user can change; no geolocation in v1 |
| Map | **Yes — Mapbox** (`VITE_MAPBOX_TOKEN` in `.env`, not committed) |
| Filters (7) | Playground, Dog-friendly, Basketball, Tennis, Beach, Skate park, Outdoor pool |
| Data loading | Live CPD API + **snapshot fallback** |
| CPD API key | **Not required** (optional Socrata app token only if rate-limited) |
| Deploy | Local how-to-run + hosted (**Railway** preferred) |
| Data source | Chicago Park District **CPD_Parks** (`ejsh-fztr`) |
| v1 posture | Thin prototype to read **signal / usage**, not habit/retention |

### Implementation notes from decisions

1. **ZIP:** Seed a sensible default (e.g. `60614`); filter client-side on `zip`.  
2. **Mapbox:** Pins need coordinates — compute centroids from `the_geom` at normalize/snapshot time (or geocode address as fallback).  
3. **Directions:** Prefer lat/lon when available; else address query URL.  
4. **API:** Phase 1 still proves live fetch first; commit `public/data/parks.json` for demo resilience.

### Out of v1

Accounts, bookings/payments, live attendance, program registration, Activities dataset, browser geolocation / near-me.

---

## Implementation plan (phased)

**Rule:** Do not start UI polish until Phase 1 exit criteria pass.

### Phase 0 — Lock open questions

**Done** — see resolved table in `open-questions.md`. Re-open only if a decision changes.

---

### Phase 1 — API spike (first engineering work)

Goal: prove we can call CPD_Parks and return usable park rows.

1. `GET` `https://data.cityofchicago.org/resource/ejsh-fztr.json` with `$select` for id/name/address/zip + chosen amenity fields; `$limit` high enough to cover ~617 parks (or page with `$offset`).  
2. Confirm amenity values and coerce string numbers → `number`.  
3. Map rows → normalized `Park` type (see schema below).  
4. Treat amenity `> 0` as “has amenity.”  
5. Optional but recommended: write `public/data/parks.json` snapshot after a successful live fetch.  
6. Smoke test: log count + 1–2 sample parks (script or throwaway page).

**Exit criteria:** Live API returns parks; normalized objects exist in code; (optional) snapshot file committed for demo resilience.

**Docs:** [SODA getting started](https://dev.socrata.com/consumers/getting-started) · [SoQL queries](https://dev.socrata.com/docs/queries/)

---

### Phase 2 — App shell (mobile web)

1. Scaffold app per stack choice in open questions.  
2. Mobile-first layout; load parks (live and/or snapshot per decision).  
3. Loading / error states for fetch failure.  
4. Footer attribution: **Data: Chicago Park District via Chicago Data Portal**.

**Exit:** App runs locally on a phone-width viewport and shows a raw or simple park list.

---

### Phase 3 — Discovery (primary UX)

Filtering is the main path.

1. Amenity filter chips (multi-select; **AND** logic — park must have all selected amenities).  
2. Location filter (ZIP and/or near me — per open questions).  
3. Optional name search (client-side or `$q`).  
4. Results list: name, address/ZIP, matching amenity labels.  
5. Empty state when filters match nothing.

**Exit:** User can filter by preferences and see a shortened list of matching parks.

---

### Phase 4 — Detail + intent

1. Park detail view (route or panel): name, address, amenities, acres/class if useful.  
2. **Get directions** CTA → external Maps URL using address (or lat/lon if centroids exist).  
3. Easy back to filtered results (preserve filter state if feasible).

**Exit:** Click-through path: filter → detail → directions.

---

### Phase 5 — Demo polish

1. Mobile + responsive pass (breakpoints, Show more, ZIP reset)  
2. How-to-run note (README + `HOW-TO-RUN.md`)  
3. Submission packaging reminder: `BRIEF.md`, build docs, prototype, transcripts  
4. Optional hosted link (Railway)

**Exit:** Resident can complete the flow on mobile and desktop without hand-holding.

---

### Phase 6 — Submission / host (current)

1. `BRIEF.md` at takehome root (max 300 words)  
2. Build docs: `markdown/plan.md`, `research.md`, `open-questions.md` (AI-directed docs)  
3. How-to-run: `Granicus_takehome/HOW-TO-RUN.md`  
4. Deploy to Railway with `VITE_MAPBOX_TOKEN` at build time  
5. Export Cursor transcripts into the zip  

**Exit:** Zip ready to send with brief, docs, prototype, how-to-run, transcripts (+ optional live URL).

---

## Suggested build order (checklist)

- [x] Phase 0 — answer `open-questions.md`  
- [x] Phase 1 — live API call + normalize (+ snapshot with centroids for Mapbox)  
- [x] Phase 2 — shell + load parks on mobile web (ChicaGO Outside)  
- [x] Phase 3 — amenity + ZIP filters + results list  
- [x] Phase 4 — detail + Mapbox map + Get directions  
- [x] Phase 5 — polish (responsive layout, Show more, ZIP reset) + how-to-run  
- [ ] Phase 6 — submission zip + Railway live URL + transcripts  

---

# Data reference — CPD_Parks

**Decision:** Chicago Park District open data as the primary real-data source.

| | |
|---|---|
| **Name** | CPD_Parks |
| **Dataset ID** | `ejsh-fztr` |
| **Portal page** | https://data.cityofchicago.org/Parks-Recreation/CPD_Parks/ejsh-fztr |
| **About / metadata** | https://data.cityofchicago.org/Parks-Recreation/CPD_Parks/ejsh-fztr/about_data |
| **JSON endpoint** | `https://data.cityofchicago.org/resource/ejsh-fztr.json` |
| **GeoJSON endpoint** | `https://data.cityofchicago.org/resource/ejsh-fztr.geojson` |
| **Attribution** | Chicago Park District |
| **License** | Public Domain |
| **Auth** | None required for light use |
| **Approx. size** | ~617 parks |

### API documentation

**Chicago / portal**

- Chicago Data Portal developer overview: https://www.chicago.gov/city/en/narr/foia/sample_code0.html  
- Dataset portal: https://data.cityofchicago.org/Parks-Recreation/CPD_Parks/ejsh-fztr  

**SODA / SoQL**

- Getting started: https://dev.socrata.com/consumers/getting-started  
- SoQL queries: https://dev.socrata.com/docs/queries/  
- `$select`: https://dev.socrata.com/docs/queries/select  
- `$where`: https://dev.socrata.com/docs/queries/where  
- `$order`: https://dev.socrata.com/docs/queries/order  
- `$limit` / `$offset`: https://dev.socrata.com/docs/queries/limit  
- `$q`: https://dev.socrata.com/docs/queries/q  
- App tokens: https://dev.socrata.com/docs/app-tokens.html  
- Response codes: https://dev.socrata.com/docs/response-codes.html  

**Optional enrichment (out of v1 unless revisited)**

- Activities (`tn7v-6rnw`): https://data.cityofchicago.org/Parks-Recreation/Chicago-Park-District-Activities/tn7v-6rnw  
- JSON: `https://data.cityofchicago.org/resource/tn7v-6rnw.json`

---

## How to call the API

- Method: `GET`  
- Format: `.json` or `.geojson`  
- Query language: SoQL via `$…` params  
- Optional header: `X-App-Token: <token>`

**List parks (attrs only — avoid huge geometries):**

```http
GET https://data.cityofchicago.org/resource/ejsh-fztr.json?$select=park_no,park,location,zip,acres,ward,park_class,playground,basketball,beach,dog_friend,tennis_cou,pool_outdo,gymnasium,skate_park,spray_feat&$order=park&$limit=1000
```

**Filter by amenity (server-side example):**

```http
GET https://data.cityofchicago.org/resource/ejsh-fztr.json?$where=playground > 0&$select=park_no,park,location,zip,playground&$limit=50
```

Prefer **fetch once + filter client-side** for multi-amenity AND logic in the prototype.

**Search by name:**

```http
GET https://data.cityofchicago.org/resource/ejsh-fztr.json?$q=lincoln&$limit=20
```

**CORS / demo tip:** Browser → Socrata often works. If blocked: proxy route, or snapshot to `public/data/parks.json`.

---

## Raw response shape

Amenity fields are numeric counts (often strings in JSON).

```json
{
  "park_no": "2.0",
  "park": "MCGUANE (JOHN)",
  "location": "2901 S POPLAR AVE",
  "zip": "60608",
  "acres": "10.3",
  "ward": "11.0",
  "park_class": "COMMUNITY PARK",
  "playground": "1",
  "basketball": "4",
  "beach": "0",
  "dog_friend": "0",
  "tennis_cou": "5",
  "the_geom": { "type": "MultiPolygon", "coordinates": [] }
}
```

### Core fields

| Field | Type | Use |
|-------|------|-----|
| `park_no` | number | Stable ID |
| `park` | text | Display name |
| `location` | text | Street address → directions |
| `zip` | text | ZIP filter |
| `acres` | number | Size |
| `ward` | number | Optional context |
| `park_class` | text | Park type |
| `the_geom` | multipolygon | Only if map/centroids needed |

### Amenity → UI labels (v1 filter set — locked)

| API field | UI label | In v1 filters |
|-----------|----------|---------------|
| `playground` | Playground | Yes |
| `dog_friend` | Dog-friendly | Yes |
| `basketball` | Basketball | Yes |
| `tennis_cou` | Tennis | Yes |
| `beach` | Beach | Yes |
| `skate_park` | Skate park | Yes |
| `pool_outdo` | Outdoor pool | Yes |

Full columns: `https://data.cityofchicago.org/api/views/ejsh-fztr.json`

---

## App-normalized schema

```ts
type AmenityKey =
  | "playground"
  | "dogFriendly"
  | "basketball"
  | "tennis"
  | "beach"
  | "skatePark"
  | "outdoorPool";

type Park = {
  id: string;
  name: string;
  address: string;
  zip: string;
  acres: number;
  ward: number | null;
  parkClass: string | null;
  amenities: Partial<Record<AmenityKey, number>>;
  lat: number;  // centroid from the_geom at normalize/snapshot time (needed for Mapbox)
  lon: number;
};
```

**Directions:**  
Prefer `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}` when coords exist; else address query.

**Mapbox:** Store centroids during Phase 1 normalize/snapshot so pins work without live geometry payloads in the UI.

---

## Data-layer checklist

1. Prove live API before building filters UI  
2. `$select` only needed columns; skip `the_geom` until map/near-me needs it  
3. Coerce string numbers; amenity `> 0` = has amenity  
4. Snapshot fallback recommended for demo  
5. Attribution in footer  
6. No committed API secrets (app token via env if used)

---

## Rejected as primary data

NPS API / RIDB — federal/national recreation, not neighborhood parks (see `research.md`).
