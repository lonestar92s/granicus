# Open questions — Local Parks v1

Phase 0 decisions for `plan.md`. Resolved answers are in the table at the bottom.

---

## 1. Stack

What should we build with?

- [x] Vite + React  
- [ ] Next.js  
- [ ] Other: _______________

*Default: Vite + React (fast for a mobile-web prototype).*

---

## 2. Location model

How does “nearby” work in v1?

For a prototype, hardcoding a default ZIP (plus optional ZIP input) is enough — skip geolocation/centroids unless trivial later.

- [x] ZIP filter only (default ZIP hardcoded; user can change)  
- [ ] Near me (browser geolocation + park centroids)  
- [ ] Both ZIP and near me  

*Resolved: ZIP only with a hardcoded default (e.g. `60614`). Near me deferred.*

---

## 3. In-app map

- [ ] No — list + detail + external “Get directions” only  
- [x] Yes — simple map of results / park  

*Resolved: Yes — Mapbox (familiar from prior work). Requires `VITE_MAPBOX_TOKEN` in `.env` (not committed).*

---

## 4. Amenity filters (pick ~5–7)

Which chips ship in v1? (persona: walk / kids / dog / sport)

- [x] Playground (`playground`)  
- [x] Dog-friendly (`dog_friend`)  
- [x] Basketball (`basketball`)  
- [x] Tennis (`tennis_cou`)  
- [x] Beach (`beach`)  
- [x] Skate park (`skate_park`)  
- [ ] Spray feature (`spray_feat`)  
- [x] Outdoor pool (`pool_outdo`)  
- [ ] Other: _______________

*Resolved: Playground, Dog-friendly, Basketball, Tennis, Beach, Skate park, Outdoor pool (7).*

---

## 5. Data loading

- [ ] Live API on every load  
- [ ] Snapshot only (`public/data/parks.json`)  
- [x] Live with snapshot fallback  

*Resolved: Live with snapshot fallback.*

**API key?** Not required for CPD_Parks / Chicago SODA (public, light use). Optional Socrata `X-App-Token` only if rate-limited. Mapbox needs its own token (separate).

---

## 6. Deploy / submission

- [ ] Local how-to-run only  
- [ ] Hosted link (e.g. Vercel)  
- [x] Both — prefer **Railway** for hosted if feasible; local how-to-run always  

*Resolved: Local how-to-run required; hosted on Railway (or Vercel if simpler for static Vite).*

---

## 7. Product name (UI)

Working name for header / title:

- [ ] Local Parks  
- [x] Other: **ChicaGO Outside**

---

## UX (resolved — implement in Phase 5 polish)

**Design must be responsive** (mobile-first, flexes by viewport).

Prior context (what we’re fixing):

- **No list pagination** — `ParkList` rendered every filtered park.
- Map pins capped at **75**, so list and map could disagree.
- With a ZIP set, counts are usually small (~11 median, ~20–24 in busy ZIPs).
- Layout was **mobile-column only** (`max-width: 480px`) on all screen sizes — replace with responsive breakpoints below.

---

### 8. Result list paging

How many parks before “Show more” / pagination?

- [ ] Flat **12** everywhere  
- [x] **10** mobile / **20** desktop  
- [ ] Other: _______________  

Pattern:

- [x] “Show more” / Load more (recommended)  
- [ ] Classic page numbers  

Also:

- [x] Map markers should match **visible list page** only  
- [ ] Map markers should show **all filtered** (cap ~50–75)  
- [x] Reset page when ZIP / amenities change — **Yes**

*Resolved: Show more at 10 (mobile) / 20 (desktop); map markers = visible list page; reset page on filter change.*

---

### 9. Responsive layout

**Locked: the UI must be responsive** — mobile-first, but layout flexes by viewport (not a permanent 480px phone column on desktop).

Breakpoints (implement):

| Viewport | Layout |
|----------|--------|
| **&lt; ~640px** | Stacked: filters → map → list (current mobile flow) |
| **~640–900px** | Wider single column (e.g. max-width ~720–840px), taller map |
| **≥ ~900px** | Side-by-side: **sticky map** + filters/list |

Detail view:

- [ ] Keep stacked (map above detail) on all sizes  
- [x] **Map + detail side-by-side on desktop** (≥~900px); stacked on smaller screens  

*Resolved: Responsive required. Mobile stack → tablet wider column → desktop map \| list; detail side-by-side on desktop.*

---

### 10. Empty ZIP behavior

Clearing the ZIP field currently means “all ZIPs” and can dump city-wide results.

- [ ] Require ZIP (block empty)  
- [x] On clear, reset to default `60614`  
- [ ] Allow empty (all ZIPs) but page aggressively  
- [ ] Other: _______________  

*Resolved: on clear, reset to default `60614`.*

---

### 11. Map / list selection polish (optional)

- [x] Taller map on desktop (e.g. 280–320px+) — **Yes** (follows responsive layout)  
- [x] Highlight selected park on browse map when relevant — **skip for v1**

*Resolved: taller map via responsive CSS; selection highlight skipped for v1.*

---

## Resolved answers

| # | Decision |
|---|----------|
| 1 Stack | Vite + React |
| 2 Location | ZIP only; hardcoded default ZIP + optional change (no geolocation in v1) |
| 3 Map | Yes — Mapbox (`VITE_MAPBOX_TOKEN`) |
| 4 Filters | Playground, Dog-friendly, Basketball, Tennis, Beach, Skate park, Outdoor pool |
| 5 Data loading | Live API + snapshot fallback (no CPD API key) |
| 6 Deploy | Local how-to-run + hosted (Railway preferred) |
| 7 Name | ChicaGO Outside |
| 8 Paging | Show more: 10 mobile / 20 desktop; map = visible page; reset on filter change |
| 9 Layout | **Responsive required** — stack (&lt;640) → wider column (640–900) → map \| list (≥900); detail side-by-side on desktop |
| 10 Empty ZIP | Reset to default `60614` on clear |
| 11 Map polish | Taller map on desktop (via responsive); skip browse selection highlight for v1 |
