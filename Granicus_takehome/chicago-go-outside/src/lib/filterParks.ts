import type { AmenityKey, Park } from "../types/park";
import { hasAmenity } from "./normalize";

export function filterParks(
  parks: Park[],
  opts: {
    zip: string;
    amenities: AmenityKey[];
    query?: string;
  },
): Park[] {
  const zip = opts.zip.trim();
  const q = opts.query?.trim().toLowerCase() ?? "";

  return parks.filter((park) => {
    if (zip && park.zip !== zip) return false;
    if (opts.amenities.length > 0) {
      const allMatch = opts.amenities.every((key) => hasAmenity(park, key));
      if (!allMatch) return false;
    }
    if (q && !park.name.toLowerCase().includes(q)) return false;
    return true;
  });
}
