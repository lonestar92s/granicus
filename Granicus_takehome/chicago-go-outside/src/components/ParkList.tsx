import type { Park } from "../types/park";
import { AMENITY_FILTERS } from "../types/park";

type Props = {
  parks: Park[];
  onSelect: (park: Park) => void;
  hasMore?: boolean;
  onShowMore?: () => void;
};

export function ParkList({ parks, onSelect, hasMore, onShowMore }: Props) {
  if (parks.length === 0) {
    return (
      <p className="empty">
        No parks match these filters. Try another ZIP or fewer amenities.
      </p>
    );
  }

  return (
    <div className="park-list-wrap">
      <ul className="park-list">
        {parks.map((park) => {
          const labels = AMENITY_FILTERS.filter(
            (f) => (park.amenities[f.key] ?? 0) > 0,
          ).map((f) => f.label);

          return (
            <li key={park.id}>
              <button
                type="button"
                className="park-card park-card--button"
                onClick={() => onSelect(park)}
              >
                <strong>{park.name}</strong>
                <div className="meta">
                  {park.address}
                  {park.zip ? ` · ${park.zip}` : ""}
                </div>
                {labels.length > 0 && (
                  <div className="amenities">{labels.join(" · ")}</div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {hasMore && onShowMore && (
        <button type="button" className="show-more" onClick={onShowMore}>
          Show more
        </button>
      )}
    </div>
  );
}
