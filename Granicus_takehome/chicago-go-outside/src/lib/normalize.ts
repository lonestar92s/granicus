import type { AmenityKey, Park } from "../types/park";
import { AMENITY_FILTERS } from "../types/park";

export type CpdParkRow = {
  park_no?: string | number;
  park?: string;
  location?: string;
  zip?: string;
  acres?: string | number;
  ward?: string | number;
  park_class?: string;
  playground?: string | number;
  dog_friend?: string | number;
  basketball?: string | number;
  tennis_cou?: string | number;
  beach?: string | number;
  skate_park?: string | number;
  pool_outdo?: string | number;
  the_geom?: {
    type: string;
    coordinates: number[][][][] | number[][][];
  };
};

function toNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Simple average of polygon ring coordinates → approximate centroid. */
export function centroidFromGeom(
  geom: CpdParkRow["the_geom"],
): { lat: number; lon: number } | null {
  if (!geom?.coordinates) return null;

  const points: [number, number][] = [];

  const walk = (node: unknown): void => {
    if (!Array.isArray(node) || node.length === 0) return;
    if (typeof node[0] === "number" && typeof node[1] === "number") {
      points.push([node[0] as number, node[1] as number]);
      return;
    }
    for (const child of node) walk(child);
  };

  walk(geom.coordinates);
  if (points.length === 0) return null;

  let sumLon = 0;
  let sumLat = 0;
  for (const [lon, lat] of points) {
    sumLon += lon;
    sumLat += lat;
  }
  return {
    lon: sumLon / points.length,
    lat: sumLat / points.length,
  };
}

export function normalizePark(row: CpdParkRow): Park | null {
  const name = (row.park ?? "").trim();
  if (!name) return null;

  const amenities: Partial<Record<AmenityKey, number>> = {};
  for (const filter of AMENITY_FILTERS) {
    const count = toNumber(row[filter.apiField as keyof CpdParkRow] as string | number);
    if (count > 0) amenities[filter.key] = count;
  }

  const centroid = centroidFromGeom(row.the_geom);
  // Chicago downtown fallback only if geometry missing (should be rare)
  const lat = centroid?.lat ?? 41.8781;
  const lon = centroid?.lon ?? -87.6298;

  return {
    id: String(toNumber(row.park_no) || name),
    name,
    address: (row.location ?? "").trim(),
    zip: String(row.zip ?? "").trim(),
    acres: toNumber(row.acres),
    ward: row.ward === undefined || row.ward === null || row.ward === ""
      ? null
      : toNumber(row.ward),
    parkClass: row.park_class?.trim() || null,
    amenities,
    lat,
    lon,
  };
}

export function hasAmenity(park: Park, key: AmenityKey): boolean {
  return (park.amenities[key] ?? 0) > 0;
}
