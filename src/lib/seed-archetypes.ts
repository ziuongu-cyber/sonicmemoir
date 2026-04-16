import { PUBLIC_ARCHETYPES } from '@/data/archetypes';
import { seedPublicArchetypesInTurbopuffer } from '@/lib/turbopuffer';

export async function seedPublicArchetypesIfNeeded() {
  return seedPublicArchetypesInTurbopuffer(PUBLIC_ARCHETYPES);
}
