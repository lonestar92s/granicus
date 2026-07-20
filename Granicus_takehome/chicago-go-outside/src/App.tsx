import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { ParkDetail } from "./components/ParkDetail";
import { ParkList } from "./components/ParkList";
import { ParksMap } from "./components/ParksMap";
import { usePageSize } from "./hooks/usePageSize";
import { filterParks } from "./lib/filterParks";
import { loadParks } from "./lib/parksApi";
import type { AmenityKey, Park } from "./types/park";
import { DEFAULT_ZIP } from "./types/park";
import "./App.css";

function App() {
  const [parks, setParks] = useState<Park[]>([]);
  const [source, setSource] = useState<"live" | "snapshot" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [zip, setZip] = useState(DEFAULT_ZIP);
  const [amenities, setAmenities] = useState<AmenityKey[]>([]);
  const [selected, setSelected] = useState<Park | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const pageSize = usePageSize(10, 20);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await loadParks();
        if (cancelled) return;
        setParks(result.parks);
        setSource(result.source);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Effective ZIP: never filter as "all city" when empty
  const effectiveZip = zip.trim() || DEFAULT_ZIP;

  const filtered = useMemo(
    () => filterParks(parks, { zip: effectiveZip, amenities }),
    [parks, effectiveZip, amenities],
  );

  // Reset visible page when filters or page size change
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [effectiveZip, amenities, pageSize]);

  const visibleParks = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  function handleZipChange(next: string) {
    setZip(next);
  }

  function handleZipBlur() {
    if (!zip.trim()) setZip(DEFAULT_ZIP);
  }

  function toggleAmenity(key: AmenityKey) {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function clearFilters() {
    setZip(DEFAULT_ZIP);
    setAmenities([]);
  }

  function showMore() {
    setVisibleCount((n) => n + pageSize);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>ChicaGO Outside</h1>
          <p className="tagline">Find a park. Get outside.</p>
        </div>
      </header>

      <main className="main">
        {loading && <p>Loading parks…</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && selected && (
          <div className="detail-layout">
            <ParksMap parks={[selected]} selectedId={selected.id} />
            <ParkDetail park={selected} onBack={() => setSelected(null)} />
          </div>
        )}

        {!loading && !error && !selected && (
          <div className="browse-layout">
            <div className="browse-map">
              <ParksMap parks={visibleParks} onSelect={setSelected} />
            </div>
            <div className="browse-sidebar">
              <FilterBar
                zip={zip}
                onZipChange={handleZipChange}
                onZipBlur={handleZipBlur}
                selected={amenities}
                onToggleAmenity={toggleAmenity}
                onClear={clearFilters}
                resultCount={filtered.length}
                showingCount={visibleParks.length}
              />
              <ParkList
                parks={visibleParks}
                onSelect={setSelected}
                hasMore={hasMore}
                onShowMore={showMore}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          Data: Chicago Park District via Chicago Data Portal
          {source ? ` · ${source}` : ""}
        </div>
      </footer>
    </div>
  );
}

export default App;
