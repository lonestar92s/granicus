import type { Park } from "../types/park";

export function directionsUrl(park: Park): string {
  if (Number.isFinite(park.lat) && Number.isFinite(park.lon)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lon}`;
  }
  const query = [park.address, "Chicago, IL", park.zip].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
