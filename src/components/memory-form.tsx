'use client';

import { useMemo, useState } from 'react';
import { MEMORY_PROMPTS } from '@/data/prompt-library';
import { useRouter } from 'next/navigation';

const moods = ['romantic', 'nostalgic', 'melancholic', 'hopeful', 'joyful', 'bittersweet', 'dreamy', 'cinematic'];

function getSessionId() {
  if (typeof window === 'undefined') return 'demo-session';
  const found = window.localStorage.getItem('sonicmemoir_session');
  if (found) return found;
  const created = `session_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem('sonicmemoir_session', created);
  return created;
}

export function MemoryForm() {
  const router = useRouter();
  const [text, setText] = useState(MEMORY_PROMPTS[0]);
  const [title, setTitle] = useState('Rain in Paris');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chars = useMemo(() => text.length, [text]);

  function handleRandomPrompt() {
    const pool = MEMORY_PROMPTS.filter((item) => item !== text);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? MEMORY_PROMPTS[0];
    setText(next);
    if (!title.trim() || title === 'Rain in Paris') {
      setTitle(next.split(/[,.]/)[0].slice(0, 42));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, title, mood, sessionId: getSessionId() }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      router.push(`/memory/${data.record?.shareSlug ?? data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl shadow-fuchsia-950/20">
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm text-white/70">Memory title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30"
            placeholder="First Kiss Outside Prom"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70">Describe the memory</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-36 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30"
            placeholder="The night we danced in the rain in Paris, 2019..."
          />
          <div className="mt-2 text-xs text-white/40">{chars} characters</div>
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70">Optional mood override</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          >
            <option value="">Auto-detect</option>
            {moods.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRandomPrompt}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-5 py-3 font-medium text-white/85 transition hover:bg-white/10"
          >
            Random memory idea
          </button>
          <button
            disabled={loading || !text.trim()}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-400 px-5 py-3 font-medium text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Scoring your memory...' : 'Generate cinematic memory'}
          </button>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </div>
    </form>
  );
}
