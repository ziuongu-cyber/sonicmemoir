import { MemoryForm } from '@/components/memory-form';
import { Timeline } from '@/components/timeline';
import { getAllMemories } from '@/lib/storage';

const featureCards = [
  {
    title: 'Cinematic generation',
    body: 'Turn a written memory into an emotional soundtrack with timed scene effects, built for replay and sharing.',
  },
  {
    title: 'Your Life Album',
    body: 'Recurring sonic motifs carry across your memories, so the app starts to sound like your own emotional universe.',
  },
  {
    title: 'Memory retrieval',
    body: 'Archetype retrieval and personal memory indexing help every new generation feel more emotionally precise.',
  },
];

const steps = [
  'Describe a memory in one sentence',
  'SonicMemoir retrieves emotional reference scenes',
  'Music and scene effects are generated into one cinematic moment',
  'Your memory joins a growing, personal Life Album',
];

export default async function Home() {
  const memories = await getAllMemories();

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed22,transparent_26%),radial-gradient(circle_at_80%_25%,#ec489922,transparent_22%),radial-gradient(circle_at_bottom,#0ea5e922,transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg backdrop-blur-xl">♪</div>
            <div>
              <div className="text-sm font-medium tracking-[0.25em] text-white/50 uppercase">SonicMemoir</div>
              <div className="text-xs text-white/35">Memory, scored like cinema</div>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/55 backdrop-blur-xl md:block">
            Powered by ElevenLabs + Turbopuffer
          </div>
        </header>

        <section className="grid items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-fuchsia-200/85">
              Your memories deserve better than text
            </div>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              Turn your life into a soundtrack people can <span className="bg-gradient-to-r from-fuchsia-300 via-violet-200 to-sky-300 bg-clip-text text-transparent">feel</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              SonicMemoir transforms personal moments into cinematic audio experiences with emotional music, scene-level sound design, and a growing Life Album that remembers your patterns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/65">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">15-second shareable memory scenes</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Recurring sonic DNA</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Premium dark cinematic UI</span>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="text-2xl font-semibold">Studio-grade</div>
                <p className="mt-2 text-sm leading-6 text-white/55">Music plus timed atmosphere layers designed to feel like a scene, not a toy demo.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="text-2xl font-semibold">Personal</div>
                <p className="mt-2 text-sm leading-6 text-white/55">Future memories inherit recurring motifs so the product becomes emotionally yours over time.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="text-2xl font-semibold">Shareable</div>
                <p className="mt-2 text-sm leading-6 text-white/55">Built for clips, reactions, and social sharing without losing the intimacy of the memory.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/20 via-transparent to-sky-400/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/6 p-3 shadow-2xl shadow-fuchsia-950/20 backdrop-blur-2xl">
              <MemoryForm />
            </div>
          </div>
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold">A premium memory engine, not just a prompt box.</h2>
            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-medium text-white/80">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/65">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.25em] text-white/35">Feature</p>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/35">Your Life Album</p>
              <h2 className="mt-3 text-3xl font-semibold">Every generated memory becomes part of a richer emotional archive.</h2>
            </div>
            <div className="hidden max-w-sm text-sm leading-7 text-white/50 lg:block">
              As your memories grow, recurring sonic motifs turn the archive into something that feels authored, intimate, and unmistakably yours.
            </div>
          </div>
          <Timeline memories={memories.slice(0, 8)} />
        </section>

        <section className="pb-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-white/6 to-white/3 p-8 backdrop-blur-xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/35">Why it feels different</p>
                <h2 className="mt-3 text-3xl font-semibold">Most AI apps generate outputs. SonicMemoir generates emotional recall.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
                  Instead of producing isolated clips, it builds continuity. Your love memories can share a soft piano motif. Your nostalgic scenes can reuse a certain rain texture. Over time, the archive begins to sound like a life, not a library.
                </p>
              </div>
              <a href="#top" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">
                Create your next memory
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
