import { promises as fs } from 'fs';
import path from 'path';
import type { MemoryRecord } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json');

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(MEMORIES_FILE);
  } catch {
    await fs.writeFile(MEMORIES_FILE, '[]', 'utf8');
  }
}

export async function getAllMemories(): Promise<MemoryRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(MEMORIES_FILE, 'utf8');
  return JSON.parse(raw) as MemoryRecord[];
}

export async function saveMemory(record: MemoryRecord) {
  const all = await getAllMemories();
  all.unshift(record);
  await fs.writeFile(MEMORIES_FILE, JSON.stringify(all, null, 2), 'utf8');
  return record;
}

export async function getMemoryById(id: string) {
  const all = await getAllMemories();
  return all.find((item) => item.id === id || item.shareSlug === id) ?? null;
}

export async function getMemoriesBySession(sessionId: string) {
  const all = await getAllMemories();
  return all.filter((item) => item.sessionId === sessionId);
}
