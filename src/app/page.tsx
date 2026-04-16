import { MemoryForm } from '@/components/memory-form';
import { Timeline } from '@/components/timeline';
import { getAllMemories } from '@/lib/storage';

export default async function Home() {
  const memories = await getAllMemories();

  return (
    <main className="min-h-screen overflow-hidden bg-[#06070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed33,transparent_30%),radial-gradient(circle_at_80%_30%,#ec489933,transparent_25%),radial-gradient(circle_at_bottom,#0ea5e933,transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/60 backdrop-blur-xl">
              SonicMemoir
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
              Your life memories, now with Hollywood soundtracks.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Describe one moment and turn it into a cinematic scene with emotional music, precise sound effects, and recurring motifs that grow into your personal life album.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 px-4 py-2">RAG-powered memory archetypes</span>
              <span className="rounded-full border border-white/10 px-4 py-2">ElevenLabs music + SFX</span>
              <span className="rounded-full border border-white/10 px-4 py-2">Shareable 15s clips</span>
            </div>
          </div>
          <MemoryForm />
        </section>

        <section className="pb-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Your Life Album</h2>
              <p className="mt-1 text-sm text-white/60">Each new generation strengthens your recurring sonic DNA.</p>
            </div>
          </div>
          <Timeline memories={memories.slice(0, 8)} />
        </section>
      </div>
    </main>
  );
}
