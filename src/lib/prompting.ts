import type { ArchetypeDocument, MemoryRecord } from '@/lib/types';

export function buildMusicPrompt(params: {
  text: string;
  mood: string;
  era: string;
  intensity: string;
  tags: string[];
  publicRefs: ArchetypeDocument[];
  privateMotifs: string[];
}) {
  const publicPalette = params.publicRefs
    .flatMap((item) => item.sonicPalette)
    .slice(0, 8)
    .join(', ');
  const motifLine = params.privateMotifs.length
    ? `Preserve recurring user sonic DNA motifs: ${params.privateMotifs.join(', ')}.`
    : 'Establish a memorable recurring sonic motif that can return in future memories.';
  const moodLabel = params.mood?.trim() || 'cinematic';

  return [
    `Create a studio-grade cinematic soundtrack for this memory: ${params.text}`,
    `Mood: ${moodLabel}. Era: ${params.era}. Intensity: ${params.intensity}.`,
    `Important memory tags: ${params.tags.join(', ') || 'personal, emotional, cinematic'}.`,
    `Reference the emotional language and arrangement feel of these retrieved archetypes: ${params.publicRefs
      .map((r) => `${r.title} (${r.soundtrackPrompt})`)
      .join(' | ')}.`,
    `Use a palette inspired by: ${publicPalette}.`,
    motifLine,
    'Deliver a cinematic structure with intro, emotional lift, and resolving final phrase. Keep it intimate, human, and shareable in a 15-20 second clip.',
  ].join(' ');
}

export function deriveMotifs(publicRefs: ArchetypeDocument[], privateRecords: MemoryRecord[]) {
  const motifs = [
    ...privateRecords.flatMap((item) => item.sonicMotifs),
    ...publicRefs.flatMap((item) => item.motifs),
  ];
  return Array.from(new Set(motifs)).slice(0, 6);
}
