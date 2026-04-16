import Turbopuffer from '@turbopuffer/turbopuffer';
import type { ArchetypeDocument, MemoryRecord } from '@/lib/types';
import { getRuntimeEnv } from '@/lib/runtime-env';

const PUBLIC_NAMESPACE = 'sonicmemoir-public-archetypes';
const privateNamespace = (sessionId: string) => `sonicmemoir-private-${sessionId}`;

function getClient() {
  const apiKey = getRuntimeEnv('TURBOPUFFER_API_KEY');
  if (!apiKey) return null;
  return new Turbopuffer({ apiKey, region: getRuntimeEnv('TURBOPUFFER_REGION') ?? 'gcp-us-central1', logLevel: 'error' });
}

async function ensurePublicSchema() {
  const client = getClient();
  if (!client) return;
  const ns = client.namespace(PUBLIC_NAMESPACE);
  await ns.updateSchema({
    schema: {
      title: { type: 'string', full_text_search: true, filterable: true },
      description: { type: 'string', full_text_search: true },
      mood: { type: 'string', filterable: true },
      era: { type: 'string', filterable: true },
      intensity: { type: 'string', filterable: true },
      soundtrackPrompt: { type: 'string', full_text_search: true },
    },
  });
}

async function ensurePrivateSchema(sessionId: string) {
  const client = getClient();
  if (!client) return;
  const ns = client.namespace(privateNamespace(sessionId));
  await ns.updateSchema({
    schema: {
      title: { type: 'string', full_text_search: true, filterable: true },
      text: { type: 'string', full_text_search: true },
      mood: { type: 'string', filterable: true },
      era: { type: 'string', filterable: true },
      intensity: { type: 'string', filterable: true },
      createdAt: { type: 'string', filterable: true },
    },
  });
}

export async function searchArchetypesViaTurbopuffer(input: {
  text: string;
  mood: string;
  era: string;
  intensity: string;
  tags: string[];
}): Promise<ArchetypeDocument[] | null> {
  const client = getClient();
  if (!client) return null;

  try {
    await ensurePublicSchema();
    const ns = client.namespace(PUBLIC_NAMESPACE);
    const result = await ns.query({
      top_k: 5,
      rank_by: ['text', 'BM25', `${input.text} ${input.tags.join(' ')} ${input.mood} ${input.era} ${input.intensity}`],
      include_attributes: ['title', 'description', 'mood', 'era', 'intensity', 'motifs', 'sonicPalette', 'soundtrackPrompt', 'sfxPrompts'],
    });

    return result.rows.map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ''),
      description: String(row.description ?? ''),
      mood: row.mood as ArchetypeDocument['mood'],
      era: String(row.era ?? ''),
      intensity: row.intensity as ArchetypeDocument['intensity'],
      motifs: (row.motifs as string[]) ?? [],
      sonicPalette: (row.sonicPalette as string[]) ?? [],
      soundtrackPrompt: String(row.soundtrackPrompt ?? ''),
      sfxPrompts: (row.sfxPrompts as ArchetypeDocument['sfxPrompts']) ?? [],
    }));
  } catch {
    return null;
  }
}

export async function upsertPrivateMemory(sessionId: string, memory: MemoryRecord) {
  const client = getClient();
  if (!client) return;

  try {
    await ensurePrivateSchema(sessionId);
    const ns = client.namespace(privateNamespace(sessionId));
    await ns.write({
      upsert_rows: [
        {
          id: memory.id,
          title: memory.title,
          text: memory.text,
          mood: memory.mood,
          era: memory.era,
          intensity: memory.intensity,
          tags: memory.tags,
          sonicMotifs: memory.sonicMotifs,
          createdAt: memory.createdAt,
        },
      ],
    });
  } catch {
    // keep app resilient
  }
}

export async function seedPublicArchetypesInTurbopuffer(docs: ArchetypeDocument[]) {
  const client = getClient();
  if (!client) return { ok: false, reason: 'missing-key' };

  try {
    await ensurePublicSchema();
    const ns = client.namespace(PUBLIC_NAMESPACE);
    await ns.write({
      upsert_rows: docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        mood: doc.mood,
        era: doc.era,
        intensity: doc.intensity,
        motifs: doc.motifs,
        sonicPalette: doc.sonicPalette,
        soundtrackPrompt: doc.soundtrackPrompt,
        sfxPrompts: doc.sfxPrompts,
      })),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : 'seed-failed' };
  }
}
