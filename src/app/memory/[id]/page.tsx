import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Waveform } from '@/components/waveform';
import { getMemoryById } from '@/lib/storage';

export default async function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memory = await getMemoryById(id);
  if (!memory) return notFound();

  return (
    <main className="min-h-screen bg-[#06070b] px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-white/50 hover:text-white/80">
          ← Back to timeline
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
              <span>{memory.mood}</span>
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

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-lg font-medium">Soundtrack direction</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{memory.soundtrackPrompt}</p>
            </div>
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
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-medium">Recurring motifs</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {memory.sonicMotifs.map((motif) => (
                  <span key={motif} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/65">
                    {motif}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-medium">Share</h3>
              <div className="mt-4 space-y-3 text-sm text-white/65">
                <p>Public clip page: <span className="text-fuchsia-300">/api/share/{memory.shareSlug}</span></p>
                <p>Perfect for 15-second TikTok or Instagram cutdowns once real audio exports are connected.</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
