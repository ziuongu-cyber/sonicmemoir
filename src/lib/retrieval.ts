import { PUBLIC_ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeDocument, MemoryRecord } from '@/lib/types';

function scoreArchetype(query: { text: string; mood: string; era: string; intensity: string; tags: string[] }, doc: ArchetypeDocument) {
  let score = 0;
  const text = query.text.toLowerCase();
  if (doc.mood === query.mood) score += 5;
  if (doc.era === query.era) score += 2;
  if (doc.intensity === query.intensity) score += 2;
  for (const tag of query.tags) {
    if (doc.description.toLowerCase().includes(tag)) score += 2;
    if (doc.motifs.some((m) => m.toLowerCase().includes(tag))) score += 2;
  }
  for (const token of text.split(/\W+/)) {
    if (!token) continue;
    if (doc.description.toLowerCase().includes(token)) score += 0.4;
    if (doc.soundtrackPrompt.toLowerCase().includes(token)) score += 0.2;
  }
  return score;
}

export function searchPublicArchetypes(query: {
  text: string;
  mood: string;
  era: string;
  intensity: string;
  tags: string[];
}) {
  return [...PUBLIC_ARCHETYPES]
    .map((doc) => ({ doc, score: scoreArchetype(query, doc) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.doc);
}

export function extractPrivateMotifs(records: MemoryRecord[]) {
  return Array.from(new Set(records.flatMap((r) => r.sonicMotifs))).slice(0, 6);
}
