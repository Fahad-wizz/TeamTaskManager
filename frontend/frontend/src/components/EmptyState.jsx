export function EmptyState({ title, detail }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      {detail && <p className="mt-1 text-sm text-zinc-500">{detail}</p>}
    </div>
  );
}
