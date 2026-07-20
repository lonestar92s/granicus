import type { Park } from "../types/park";
import { AMENITY_FILTERS } from "../types/park";
import { directionsUrl } from "../lib/directions";

type Props = {
  park: Park;
  onBack: () => void;
};

export function ParkDetail({ park, onBack }: Props) {
  const labels = AMENITY_FILTERS.filter(
    (f) => (park.amenities[f.key] ?? 0) > 0,
  );

  return (
    <article className="detail">
      <button type="button" className="linkish back" onClick={onBack}>
        ← Back to results
      </button>

      <h2>{park.name}</h2>
      <p className="meta">
        {park.address}
        {park.zip ? ` · ${park.zip}` : ""}
      </p>
      {park.parkClass && <p className="meta">{park.parkClass}</p>}
      {park.acres > 0 && <p className="meta">{park.acres} acres</p>}

      <h3>Amenities</h3>
      {labels.length === 0 ? (
        <p className="meta">None of the v1 amenity filters apply here.</p>
      ) : (
        <ul className="amenity-list">
          {labels.map((f) => (
            <li key={f.key}>
              {f.label}
              {(park.amenities[f.key] ?? 0) > 1
                ? ` (${park.amenities[f.key]})`
                : ""}
            </li>
          ))}
        </ul>
      )}

      <a
        className="cta"
        href={directionsUrl(park)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get directions
      </a>
    </article>
  );
}
