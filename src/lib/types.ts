export type Mood =
  | 'romantic'
  | 'nostalgic'
  | 'melancholic'
  | 'hopeful'
  | 'joyful'
  | 'bittersweet'
  | 'dreamy'
  | 'cinematic';

export type Intensity = 'low' | 'medium' | 'high';

export interface MemoryInput {
  text: string;
  title?: string;
  mood?: Mood;
  era?: string;
  intensity?: Intensity;
  tags?: string[];
}

export interface ArchetypeDocument {
  id: string;
  title: string;
  description: string;
  mood: Mood;
  era: string;
  intensity: Intensity;
  motifs: string[];
  sonicPalette: string[];
  soundtrackPrompt: string;
  sfxPrompts: Array<{ prompt: string; duration: number; startAt: number }>;
}

export interface GeneratedAsset {
  kind: 'music' | 'sfx';
  label: string;
  prompt: string;
  duration: number;
  startAt?: number;
  url: string;
}

export interface MemoryRecord {
  id: string;
  sessionId: string;
  title: string;
  text: string;
  mood: Mood;
  era: string;
  intensity: Intensity;
  tags: string[];
  createdAt: string;
  soundtrackPrompt: string;
  sonicMotifs: string[];
  references: ArchetypeDocument[];
  assets: GeneratedAsset[];
  shareSlug: string;
}
