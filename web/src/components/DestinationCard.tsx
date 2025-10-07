type Destination = {
  id: string;
  slug: string;
  name: string;
  driveTimeMins: number;
  photoUrl: string;
  category?: string;
};

function labelForMinutes(mins: number): string {
  if (mins <= 30) return "Less than 30 Minutes";
  if (mins <= 90) return "Less than 90 Minutes";
  if (mins <= 180) return "Less than 3 Hours";
  if (mins <= 300) return "Less than 5 Hours";
  if (mins <= 480) return "Less than 8 Hours";
  return "Less than 12 Hours";
}

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-black/[.04] overflow-hidden">
      <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${d.photoUrl || "/utah-placeholder.jpg"})` }} />
      <div className="p-4">
        <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
          {labelForMinutes(d.driveTimeMins)}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{d.name}</h3>
        <div className="mt-2 text-slate-600 text-sm">{Math.round(d.driveTimeMins / 60)}h {d.driveTimeMins % 60}m</div>
      </div>
    </div>
  );
}


