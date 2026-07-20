import { CPD_ENDPOINT } from "../types/park";
import type { Park } from "../types/park";
import { normalizePark, type CpdParkRow } from "./normalize";

const SELECT_FIELDS = [
  "park_no",
  "park",
  "location",
  "zip",
  "acres",
  "ward",
  "park_class",
  "playground",
  "dog_friend",
  "basketball",
  "tennis_cou",
  "beach",
  "skate_park",
  "pool_outdo",
  "the_geom",
].join(",");

export async function fetchParksFromApi(): Promise<Park[]> {
  const url = new URL(CPD_ENDPOINT);
  url.searchParams.set("$select", SELECT_FIELDS);
  url.searchParams.set("$limit", "1000");
  url.searchParams.set("$order", "park");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`CPD API error ${res.status}: ${res.statusText}`);
  }

  const rows = (await res.json()) as CpdParkRow[];
  const parks: Park[] = [];
  for (const row of rows) {
    const park = normalizePark(row);
    if (park) parks.push(park);
  }
  return parks;
}

export async function fetchParksSnapshot(): Promise<Park[]> {
  const res = await fetch("/data/parks.json");
  if (!res.ok) {
    throw new Error(`Snapshot missing or failed (${res.status})`);
  }
  return (await res.json()) as Park[];
}

/** Live first; fall back to snapshot on failure. */
export async function loadParks(): Promise<{
  parks: Park[];
  source: "live" | "snapshot";
}> {
  try {
    const parks = await fetchParksFromApi();
    if (parks.length === 0) throw new Error("Live API returned 0 parks");
    return { parks, source: "live" };
  } catch (liveError) {
    console.warn("Live CPD fetch failed, using snapshot:", liveError);
    const parks = await fetchParksSnapshot();
    return { parks, source: "snapshot" };
  }
}
