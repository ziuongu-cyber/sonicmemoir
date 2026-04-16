import { NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeInput } from '@/lib/analysis';
import { generateMusic, generateSfx } from '@/lib/providers';
import { buildMusicPrompt, deriveMotifs } from '@/lib/prompting';
import { searchPublicArchetypes, extractPrivateMotifs } from '@/lib/retrieval';
import { getMemoriesBySession, saveMemory } from '@/lib/storage';
import { searchArchetypesViaTurbopuffer, upsertPrivateMemory } from '@/lib/turbopuffer';
import { slugify, uid } from '@/lib/utils';

const schema = z.object({
  sessionId: z.string().min(2),
  title: z.string().optional(),
  text: z.string().min(10),
  mood: z.string().optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const normalized = normalizeInput({
    text: body.text,
    title: body.title,
    mood: body.mood as never,
  });

  const privateMemories = await getMemoriesBySession(body.sessionId);
  const turbopufferRefs = await searchArchetypesViaTurbopuffer({
    text: normalized.text,
    mood: normalized.mood,
    era: normalized.era,
    intensity: normalized.intensity,
    tags: normalized.tags,
  });
  const publicRefs = turbopufferRefs?.length
    ? turbopufferRefs
    : searchPublicArchetypes({
        text: normalized.text,
        mood: normalized.mood,
        era: normalized.era,
        intensity: normalized.intensity,
        tags: normalized.tags,
      });

  const privateMotifs = extractPrivateMotifs(privateMemories);
  const musicPrompt = buildMusicPrompt({
    text: normalized.text,
    mood: normalized.mood,
    era: normalized.era,
    intensity: normalized.intensity,
    tags: normalized.tags,
    publicRefs,
    privateMotifs,
  });

  const music = await generateMusic(musicPrompt);
  const sfx = await Promise.all(
    publicRefs
      .flatMap((ref) => ref.sfxPrompts)
      .slice(0, 4)
      .map((item, index) => generateSfx(item.prompt, item.duration, item.startAt, index)),
  );

  const sonicMotifs = deriveMotifs(publicRefs, privateMemories);
  const title = normalized.title?.trim() || normalized.text.split(/[,.]/)[0].slice(0, 42);
  const id = uid('memory');
  const record = await saveMemory({
    id,
    sessionId: body.sessionId,
    title,
    text: normalized.text,
    mood: normalized.mood,
    era: normalized.era,
    intensity: normalized.intensity,
    tags: normalized.tags,
    createdAt: new Date().toISOString(),
    soundtrackPrompt: musicPrompt,
    sonicMotifs,
    references: publicRefs,
    assets: [music, ...sfx],
    shareSlug: `${slugify(title)}-${id.slice(-5)}`,
  });

  await upsertPrivateMemory(body.sessionId, record);

  return NextResponse.json({ id: record.id, record });
}
