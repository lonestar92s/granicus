# How to run — ChicaGO Outside

## Local (required)

```bash
cd chicago-go-outside
npm install
npm run fetch-parks          # optional refresh of public/data/parks.json
cp .env.example .env         # then set VITE_MAPBOX_TOKEN for the map
npm run dev
```

Open http://localhost:5173 (or the URL Vite prints).

- Without Mapbox token: filters, list, detail, and **Get directions** still work.
- With token: Mapbox map of visible results.

### Demo click path

1. Default ZIP `60614` (change or Clear filters as needed)  
2. Select amenity chips (AND)  
3. Open a park → **Get directions**  
4. Resize browser to see responsive layout (stack → side-by-side at ≥900px)

### Production build locally

```bash
cd chicago-go-outside
npm run build
npm start                    # serves dist on PORT (default 3000)
```

## Hosted (Railway)

App lives in `chicago-go-outside/`. From that directory:

1. Create a Railway project from this repo/folder  
2. Set root directory to `chicago-go-outside` if the repo is the parent takehome folder  
3. Add variable: `VITE_MAPBOX_TOKEN` = your Mapbox public token (**must be present at build time** for Vite)  
4. Build: `npm run build` · Start: `npm start` (see `railway.toml` / `package.json`)

Railway injects `PORT`; `serve` listens on it.

## Submission package contents

| Item | Location |
|------|----------|
| Product brief | `BRIEF.md` |
| AI build / research docs | `../markdown/` (`brief.md`, `plan.md`, `research.md`, `open-questions.md`) |
| Prototype | `chicago-go-outside/` |
| How to run | this file + `chicago-go-outside/README.md` |
| AI transcripts | export from Cursor and include in the zip |

Do **not** include `.env` (secrets). `.env.example` is fine.
