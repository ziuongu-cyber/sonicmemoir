import Link from 'next/link';
import type { MemoryRecord } from '@/lib/types';

export function Timeline({ memories }: { memories: MemoryRecord[] }) {
  if (!memories.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/60 backdrop-blur-xl">
        No memories yet. Generate your first scene and start building your life album.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {memories.map((memory) => (
        <Link
          key={memory.id}
          href={`/memory/${memory.id}`}
          className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-fuchsia-400/40 hover:bg-white/8"
        >
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/40">
            <span>{memory.mood}</span>
            <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-xl font-semibold text-white">{memory.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-white/65">{memory.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {memory.sonicMotifs.map((motif) => (
              <span key={motif} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                {motif}
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm text-fuchsia-300 transition group-hover:text-fuchsia-200">Open memory →</div>
        </Link>
      ))}
    </div>
  );
}
