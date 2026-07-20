# ChicaGO Outside

Mobile-first, responsive web app: help Chicago residents find a nearby park by amenity preference, then get directions.

See also: `../HOW-TO-RUN.md` and `../BRIEF.md` for submission packaging.

## Local setup

```bash
npm install
npm run fetch-parks   # live CPD API → public/data/parks.json
cp .env.example .env  # add VITE_MAPBOX_TOKEN for the map
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

### Mapbox

Without `VITE_MAPBOX_TOKEN`, filters / list / detail / **Get directions** still work. The map shows a short fallback.

1. Token: https://account.mapbox.com/  
2. `.env` → `VITE_MAPBOX_TOKEN=pk....`  
3. Restart `npm run dev`

## What to click through

1. Default ZIP `60614`  
2. Amenity chips (AND filter) + Show more as needed  
3. Park detail → **Get directions**  
4. Widen the window (≥900px) for map | list layout  

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run fetch-parks` | CPD API → snapshot |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm start` | Serve `dist/` (Railway / local preview) |

## Railway

1. New project → deploy from `chicago-go-outside`  
2. Set **`VITE_MAPBOX_TOKEN`** (available at **build** time)  
3. Uses `railway.toml`: build `npm run build`, start `npm start`

## Data

- Live: `https://data.cityofchicago.org/resource/ejsh-fztr.json` (no API key)  
- Fallback: `public/data/parks.json`  
- Attribution: Chicago Park District via Chicago Data Portal  
