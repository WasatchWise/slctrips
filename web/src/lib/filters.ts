export type Destination = {
  id: string;
  slug: string;
  name: string;
  category?: string;
  subcategory?: string;
  rating?: number;
  driveTimeMins: number;
  description_short?: string;
  description_long?: string;
};

export type DriveBand = {
  label: string;
  min: number;
  max: number;
};

export const DRIVE_BANDS: DriveBand[] = [
  { label: "30 minutes", min: 0, max: 30 },
  { label: "90 minutes", min: 31, max: 90 },
  { label: "3 hours", min: 91, max: 180 },
  { label: "5 hours", min: 181, max: 300 },
  { label: "8 hours", min: 301, max: 480 },
  { label: "12 hours", min: 481, max: 720 },
];

export function bandFromLabel(label?: string | null): DriveBand | undefined {
  if (!label) return undefined;
  const lower = label.toLowerCase();
  return DRIVE_BANDS.find((b) => b.label.toLowerCase() === lower);
}

export function applySearchFilter(list: Destination[], q: string): Destination[] {
  const s = q.trim().toLowerCase();
  if (!s) return list;
  return list.filter((d) =>
    [d.name, d.category, d.subcategory, d.description_short, d.description_long]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(s))
  );
}

export function applyCategoryFilter(list: Destination[], category?: string, subcategory?: string): Destination[] {
  let out = list;
  if (category && category !== "All") out = out.filter((d) => d.category === category);
  if (subcategory && subcategory !== "All") out = out.filter((d) => d.subcategory === subcategory);
  return out;
}

export function applyDriveBandFilter(list: Destination[], band?: DriveBand): Destination[] {
  if (!band) return list;
  return list.filter((d) => d.driveTimeMins >= band.min && d.driveTimeMins <= band.max);
}

export type SortKey = "name_asc" | "rating_desc" | "drive_time_asc";

export function sortDestinations(list: Destination[], sort: SortKey): Destination[] {
  const copy = [...list];
  switch (sort) {
    case "rating_desc":
      return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "drive_time_asc":
      return copy.sort((a, b) => a.driveTimeMins - b.driveTimeMins);
    case "name_asc":
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}


