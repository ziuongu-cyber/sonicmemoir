import type { Intensity, MemoryInput, Mood } from '@/lib/types';

const MOODS: Mood[] = [
  'romantic',
  'nostalgic',
  'melancholic',
  'hopeful',
  'joyful',
  'bittersweet',
  'dreamy',
  'cinematic',
];

export function inferMood(text: string): Mood {
  const lower = text.toLowerCase();
  if (/(kiss|love|danced|hug|wedding|romantic|crush)/.test(lower)) return 'romantic';
  if (/(childhood|summer|remember|old|school|back then)/.test(lower)) return 'nostalgic';
  if (/(goodbye|left|lost|miss|cry|empty)/.test(lower)) return 'melancholic';
  if (/(finally|breakthrough|healed|started again|hope)/.test(lower)) return 'hopeful';
  if (/(laugh|celebrate|joy|birthday|victory)/.test(lower)) return 'joyful';
  if (/(bittersweet|almost|never again|first kiss)/.test(lower)) return 'bittersweet';
  if (/(dream|moon|night drive|fog|float)/.test(lower)) return 'dreamy';
  return 'cinematic';
}

export function inferIntensity(text: string): Intensity {
  const lower = text.toLowerCase();
  if (/(heart racing|screamed|cried|shaking|intense|couldn't breathe|panic)/.test(lower)) return 'high';
  if (text.length < 120) return 'low';
  return 'medium';
}

export function inferEra(text: string) {
  const year = text.match(/(19|20)\d{2}/)?.[0];
  if (year) return year;
  if (/(childhood|kid|school)/i.test(text)) return 'childhood';
  if (/(future|later|tomorrow)/i.test(text)) return 'modern';
  return 'timeless';
}

export function extractTags(text: string) {
  const candidates = text
    .toLowerCase()
    .match(/\b(paris|rain|dance|kiss|train|summer|night|rooftop|city|beach|church|school|station|music|heartbeat|storm)\b/g);
  return Array.from(new Set(candidates ?? [])).slice(0, 8);
}

export function normalizeInput(input: MemoryInput) {
  return {
    ...input,
    mood: input.mood ?? inferMood(input.text),
    intensity: input.intensity ?? inferIntensity(input.text),
    era: input.era ?? inferEra(input.text),
    tags: input.tags?.length ? input.tags : extractTags(input.text),
  };
}

export function isMood(value: string): value is Mood {
  return MOODS.includes(value as Mood);
}
