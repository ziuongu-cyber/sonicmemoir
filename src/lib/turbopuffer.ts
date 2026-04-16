import type { ArchetypeDocument, MemoryRecord } from '@/lib/types';

const API_BASE = 'https://api.turbopuffer.com/v1';
const PUBLIC_NAMESPACE = 'sonicmemoir-public-archetypes';
const privateNamespace = (sessionId: string) => `sonicmemoir-private-${sessionId}`;

async function tpFetch(path: string, init: RequestInit = {}) {
  const apiKey = process.env.TURBOPUFFER_API_KEY;
  if (!apiKey) throw new Error('Missing TURBOPUFFER_API_KEY');

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turbopuffer error ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function searchArchetypesViaTurbopuffer(input: {
  text: string;
  mood: string;
  era: string;
  intensity: string;
  tags: string[];
}): Promise<ArchetypeDocument[] | null> {
  if (!process.env.TURBOPUFFER_API_KEY) return null;

  try {
    const result = await tpFetch(`/namespaces/${PUBLIC_NAMESPACE}/query`, {
      method: 'POST',
      body: JSON.stringify({
        top_k: 5,
        rank_by: ['bm25', 'document'],
        query: `${input.text} mood:${input.mood} era:${input.era} intensity:${input.intensity} ${input.tags.join(' ')}`,
      }),
    });

    const rows = (result?.rows ?? []) as Array<{ document?: ArchetypeDocument }>;
    return rows.map((row) => row.document).filter(Boolean) as ArchetypeDocument[];
  } catch {
    return null;
  }
}

export async function upsertPrivateMemory(sessionId: string, memory: MemoryRecord) {
  if (!process.env.TURBOPUFFER_API_KEY) return;

  try {
    await tpFetch(`/namespaces/${privateNamespace(sessionId)}`, {
      method: 'POST',
      body: JSON.stringify({
        upserts: [
          {
            id: memory.id,
            document: {
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
          },
        ],
      }),
    });
  } catch {
    // keep app resilient even if private memory sync fails
  }
}
