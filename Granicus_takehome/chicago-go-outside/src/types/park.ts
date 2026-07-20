export type AmenityKey =
  | "playground"
  | "dogFriendly"
  | "basketball"
  | "tennis"
  | "beach"
  | "skatePark"
  | "outdoorPool";

export type Park = {
  id: string;
  name: string;
  address: string;
  zip: string;
  acres: number;
  ward: number | null;
  parkClass: string | null;
  amenities: Partial<Record<AmenityKey, number>>;
  lat: number;
  lon: number;
};

export const AMENITY_FILTERS: { key: AmenityKey; label: string; apiField: string }[] = [
  { key: "playground", label: "Playground", apiField: "playground" },
  { key: "dogFriendly", label: "Dog-friendly", apiField: "dog_friend" },
  { key: "basketball", label: "Basketball", apiField: "basketball" },
  { key: "tennis", label: "Tennis", apiField: "tennis_cou" },
  { key: "beach", label: "Beach", apiField: "beach" },
  { key: "skatePark", label: "Skate park", apiField: "skate_park" },
  { key: "outdoorPool", label: "Outdoor pool", apiField: "pool_outdo" },
];

export const DEFAULT_ZIP = "60614";

export const CPD_ENDPOINT =
  "https://data.cityofchicago.org/resource/ejsh-fztr.json";
