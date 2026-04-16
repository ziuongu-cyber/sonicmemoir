'use client';

import { useMemo, useRef } from 'react';
import type { GeneratedAsset } from '@/lib/types';

export function ScenePlayer({ assets }: { assets: GeneratedAsset[] }) {
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const playable = useMemo(
    () => assets.filter((asset) => asset.status === 'ready' && (asset.url.startsWith('data:audio') || asset.url.startsWith('https://'))),
    [assets],
  );

  function playScene() {
    playable.forEach((asset, index) => {
      const node = audioRefs.current[index];
      if (!node) return;
      node.currentTime = 0;
      window.setTimeout(() => {
        void node.play();
      }, (asset.startAt ?? 0) * 1000);
    });
  }

  function stopScene() {
    audioRefs.current.forEach((node) => {
      if (!node) return;
      node.pause();
      node.currentTime = 0;
    });
  }

  if (!playable.length) return null;

  return (
    <div className="mt-6 rounded-3xl border border-fuchsia-400/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Play full scene</h2>
          <p className="mt-1 text-sm text-white/60">Starts soundtrack and timed effects together.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={playScene} className="rounded-2xl bg-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
            Play scene
          </button>
          <button onClick={stopScene} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
            Stop
          </button>
        </div>
      </div>
      <div className="mt-4 hidden">
        {playable.map((asset, index) => (
          <audio key={`${asset.label}-${index}`} ref={(node) => { audioRefs.current[index] = node; }} src={asset.url} preload="auto" />
        ))}
      </div>
    </div>
  );
}
