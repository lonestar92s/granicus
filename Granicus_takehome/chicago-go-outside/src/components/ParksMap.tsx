import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Park } from "../types/park";

type Props = {
  parks: Park[];
  selectedId?: string | null;
  onSelect?: (park: Park) => void;
};

export function ParksMap({ parks, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-87.6298, 41.8781],
      zoom: 11,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !token) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (parks.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    for (const park of parks) {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        park.id === selectedId ? "map-marker map-marker--selected" : "map-marker";
      el.setAttribute("aria-label", park.name);
      el.addEventListener("click", () => onSelectRef.current?.(park));

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([park.lon, park.lat])
        .addTo(map);
      markersRef.current.push(marker);
      bounds.extend([park.lon, park.lat]);
    }

    map.resize();

    if (parks.length === 1) {
      map.easeTo({ center: [parks[0].lon, parks[0].lat], zoom: 14 });
    } else if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 40, maxZoom: 13 });
    }
  }, [parks, selectedId, token]);

  if (!token) {
    return (
      <div className="map-fallback">
        Map needs <code>VITE_MAPBOX_TOKEN</code> in <code>.env</code>. List +
        directions still work.
      </div>
    );
  }

  return <div ref={containerRef} className="map" role="region" aria-label="Parks map" />;
}
