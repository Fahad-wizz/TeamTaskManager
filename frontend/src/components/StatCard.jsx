export function StatCard({ icon: Icon, label, value, tone = "zinc" }) {
  const tones = {
    zinc: "border-zinc-200 bg-white text-zinc-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    rose: "border-rose-200 bg-rose-50 text-rose-900"
  };

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Icon className="h-5 w-5 opacity-70" />
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
