import type { MemoryRecord } from '@/lib/types';

type D1Binding = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
      first: <T = unknown>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
  exec: (query: string) => Promise<unknown>;
};

declare global {
  // eslint-disable-next-line no-var
  var __SONICMEMOIR_MEMORY_STORE__: MemoryRecord[] | undefined;
}

function getMemoryStore() {
  if (!globalThis.__SONICMEMOIR_MEMORY_STORE__) {
    globalThis.__SONICMEMOIR_MEMORY_STORE__ = [];
  }
  return globalThis.__SONICMEMOIR_MEMORY_STORE__;
}

function getDb(): D1Binding | null {
  return (globalThis as { DB?: D1Binding }).DB ?? null;
}

async function ensureSchema(db: D1Binding) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      shareSlug TEXT NOT NULL,
      sessionId TEXT NOT NULL,
      title TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_memories_sessionId ON memories(sessionId);
    CREATE INDEX IF NOT EXISTS idx_memories_shareSlug ON memories(shareSlug);
    CREATE INDEX IF NOT EXISTS idx_memories_createdAt ON memories(createdAt);
  `);
}

export async function getAllMemories(): Promise<MemoryRecord[]> {
  const db = getDb();
  if (!db) {
    return [...getMemoryStore()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  await ensureSchema(db);
  const { results } = await db
    .prepare('SELECT payload FROM memories ORDER BY createdAt DESC')
    .bind()
    .all<{ payload: string }>();
  return results.map((row) => JSON.parse(row.payload) as MemoryRecord);
}

export async function saveMemory(record: MemoryRecord) {
  const db = getDb();
  if (!db) {
    getMemoryStore().unshift(record);
    return record;
  }

  await ensureSchema(db);
  await db
    .prepare(
      'INSERT INTO memories (id, shareSlug, sessionId, title, payload, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .bind(record.id, record.shareSlug, record.sessionId, record.title, JSON.stringify(record), record.createdAt)
    .run();
  return record;
}

export async function getMemoryById(id: string) {
  const db = getDb();
  if (!db) {
    return getMemoryStore().find((item) => item.id === id || item.shareSlug === id) ?? null;
  }

  await ensureSchema(db);
  const row = await db
    .prepare('SELECT payload FROM memories WHERE id = ? OR shareSlug = ? LIMIT 1')
    .bind(id, id)
    .first<{ payload: string }>();
  return row ? (JSON.parse(row.payload) as MemoryRecord) : null;
}

export async function getMemoriesBySession(sessionId: string) {
  const db = getDb();
  if (!db) {
    return getMemoryStore().filter((item) => item.sessionId === sessionId);
  }

  await ensureSchema(db);
  const { results } = await db
    .prepare('SELECT payload FROM memories WHERE sessionId = ? ORDER BY createdAt DESC')
    .bind(sessionId)
    .all<{ payload: string }>();
  return results.map((row) => JSON.parse(row.payload) as MemoryRecord);
}
