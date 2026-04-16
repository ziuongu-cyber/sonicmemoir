import { PUBLIC_ARCHETYPES } from '@/data/archetypes';
import { getRuntimeEnv } from '@/lib/runtime-env';

const API_BASE = 'https://api.turbopuffer.com/v1';
const PUBLIC_NAMESPACE = 'sonicmemoir-public-archetypes';

export async function seedPublicArchetypesIfNeeded() {
  const apiKey = getRuntimeEnv('TURBOPUFFER_API_KEY');
  if (!apiKey) return { ok: false, reason: 'missing-key' };

  try {
    await fetch(`${API_BASE}/namespaces/${PUBLIC_NAMESPACE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        upserts: PUBLIC_ARCHETYPES.map((doc) => ({ id: doc.id, document: doc })),
      }),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : 'seed-failed' };
  }
}
