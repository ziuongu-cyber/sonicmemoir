'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Waveform } from '@/components/waveform';
import { ScenePlayer } from '@/components/scene-player';
import type { MemoryRecord } from '@/lib/types';

function getCachedMemory(id: string) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('sonicmemoir_cached_memories');
    if (!raw) return null;
    const all = JSON.parse(raw) as MemoryRecord[];
    return all.find((item) => item.id === id || item.shareSlug === id) ?? null;
  } catch {
    return null;
  }
}

export function MemoryFallbackPage({ id }: { id: string }) {
  const [memory, setMemory] = useState<MemoryRecord | null>(null);

  useEffect(() => {
    setMemory(getCachedMemory(id));
  }, [id]);

  const hasAudio = useMemo(
    () => !!memory?.assets?.[0] && (memory.assets[0].url?.startsWith('data:audio') || memory.assets[0].url?.startsWith('https://')),
    [memory],
  );

  if (!memory) {
    return (
      <main className="min-h-screen bg-[#06070b] px-6 py-10 text-white lg:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">This memory is not available right now.</h1>
          <p className="mt-4 text-white/60">It may not have finished persisting yet. Try generating again or go back to the timeline.</p>
          <Link href="/" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06070b] px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-white/50 hover:text-white/80">
          ← Back to timeline
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
              <span>{memory.mood || 'cinematic'}</span>
              <span>•</span>
              <span>{memory.era}</span>
              <span>•</span>
              <span>{memory.intensity}</span>
            </div>
            <h1 className="text-4xl font-semibold">{memory.title}</h1>
            <p className="mt-4 max-w-2xl text-white/70">{memory.text}</p>

            <div className="mt-8">
              <Waveform />
            </div>

            <ScenePlayer assets={memory.assets} />

            {hasAudio ? (
              <div className="mt-6 rounded-3xl border border-fuchsia-400/20 bg-black/20 p-5">
                <h2 className="text-lg font-medium">Listen</h2>
                <audio controls className="mt-4 w-full" src={memory.assets[0].url} />
              </div>
            ) : null}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-medium">Scene layers</h3>
              <div className="mt-4 space-y-3">
                {memory.assets.map((asset, index) => (
                  <div key={`${asset.label}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{asset.label}</span>
                      <span className="text-white/45">{asset.duration}s</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-white/55">{asset.prompt}</p>
                    {asset.url?.startsWith('data:audio') || asset.url?.startsWith('https://') ? (
                      <audio controls className="mt-3 w-full" src={asset.url} />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
