import Link from "next/link";

type Ring = { label: string; min: number; max: number; color?: string };

const defaultRings: Ring[] = [
  { label: "30 minutes", min: 0, max: 30, color: "bg-[#f8b439]" },
  { label: "90 minutes", min: 31, max: 90, color: "bg-[#e0593e]" },
  { label: "3 hours", min: 91, max: 180, color: "bg-[#1da1f2]" },
  { label: "5 hours", min: 181, max: 300, color: "bg-[#2da44e]" },
  { label: "8 hours", min: 301, max: 480, color: "bg-[#7e22ce]" },
  { label: "12 hours", min: 481, max: 720, color: "bg-[#f59e0b]" },
];

export default function BullseyeChips({ rings = defaultRings }: { rings?: Ring[] }) {
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-3">
      {rings.map((r) => (
        <Link
          key={r.label}
          href={`/destinations?drive=${encodeURIComponent(r.label)}`}
          className={`px-4 py-2 rounded-full text-white shadow/50 shadow-md hover:shadow-lg transition ${r.color} hover:opacity-95`}
        >
          {r.label}
        </Link>
      ))}
    </div>
  );
}


