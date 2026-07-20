/**
 * Phase 1 spike: fetch CPD_Parks live, normalize, write public/data/parks.json
 *
 * Run: npm run fetch-parks
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchParksFromApi } from "../src/lib/parksApi.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../public/data/parks.json");

async function main() {
  console.log("Fetching CPD_Parks (ejsh-fztr)...");
  const parks = await fetchParksFromApi();
  console.log(`Normalized ${parks.length} parks`);

  if (parks.length === 0) {
    throw new Error("No parks returned — aborting snapshot");
  }

  const sample = parks.slice(0, 2);
  console.log("Sample:", JSON.stringify(sample, null, 2));

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(parks, null, 2));
  console.log(`Wrote snapshot → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
