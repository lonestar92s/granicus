import type { AmenityKey } from "../types/park";
import { AMENITY_FILTERS, DEFAULT_ZIP } from "../types/park";

type Props = {
  zip: string;
  onZipChange: (zip: string) => void;
  onZipBlur?: () => void;
  selected: AmenityKey[];
  onToggleAmenity: (key: AmenityKey) => void;
  onClear: () => void;
  resultCount: number;
  showingCount: number;
};

export function FilterBar({
  zip,
  onZipChange,
  onZipBlur,
  selected,
  onToggleAmenity,
  onClear,
  resultCount,
  showingCount,
}: Props) {
  return (
    <section className="filters" aria-label="Park filters">
      <label className="zip-field">
        <span>ZIP</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={zip}
          onChange={(e) => onZipChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onBlur={onZipBlur}
          placeholder="60614"
          aria-label="ZIP code"
        />
      </label>

      <p className="filter-label">What do you want to do?</p>
      <div className="chips" role="group" aria-label="Amenities">
        {AMENITY_FILTERS.map((f) => {
          const active = selected.includes(f.key);
          return (
            <button
              key={f.key}
              type="button"
              className={`chip${active ? " chip--active" : ""}`}
              aria-pressed={active}
              onClick={() => onToggleAmenity(f.key)}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="filter-meta">
        <span>
          Showing {showingCount} of {resultCount} park
          {resultCount === 1 ? "" : "s"}
        </span>
        {(selected.length > 0 || zip !== DEFAULT_ZIP) && (
          <button type="button" className="linkish" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}
