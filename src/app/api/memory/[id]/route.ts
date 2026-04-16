import { NextResponse } from 'next/server';
import { getMemoryById } from '@/lib/storage';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memory = await getMemoryById(id);
  if (!memory) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(memory);
}
