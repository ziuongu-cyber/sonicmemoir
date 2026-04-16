export function Waveform() {
  const bars = new Array(36).fill(0).map((_, index) => ((index * 17) % 70) + 18);
  return (
    <div className="flex h-28 items-end gap-1 rounded-3xl border border-white/10 bg-black/20 px-4 py-5">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-full rounded-full bg-gradient-to-t from-sky-400 via-violet-500 to-fuchsia-400 opacity-80"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
