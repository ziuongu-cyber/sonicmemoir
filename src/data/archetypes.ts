import type { ArchetypeDocument } from '@/lib/types';

export const PUBLIC_ARCHETYPES: ArchetypeDocument[] = [
  {
    id: 'rain-paris-dance',
    title: 'Rain-soaked city dance',
    description:
      'Two people dancing in light rain on old stone streets, feeling suspended in time under warm city lights.',
    mood: 'romantic',
    era: 'modern',
    intensity: 'medium',
    motifs: ['piano theme', 'soft rain', 'distant laughter'],
    sonicPalette: ['indie-folk strings', 'upright piano', 'tape warmth'],
    soundtrackPrompt:
      'cinematic indie-folk, tender and intimate, warm piano with swelling strings, soft rise into a hopeful chorus, 78 bpm',
    sfxPrompts: [
      { prompt: 'soft rain on cobblestones', duration: 12, startAt: 0 },
      { prompt: 'distant joyful laughter fading', duration: 4, startAt: 3 },
      { prompt: 'gentle city ambience at night', duration: 10, startAt: 0 },
    ],
  },
  {
    id: 'first-kiss-prom-night',
    title: 'First kiss after a long night',
    description:
      'A nervous first kiss after dancing, with adrenaline, muffled music from inside, and a quiet street outside.',
    mood: 'bittersweet',
    era: '2010s',
    intensity: 'high',
    motifs: ['heartbeat', 'muffled bass', 'night air'],
    sonicPalette: ['bedroom pop', 'cinematic pulse', 'reverb guitar'],
    soundtrackPrompt:
      'bedroom-pop meets cinematic score, vulnerable, breathy textures, pulsing low heartbeat, emotional release in chorus, 82 bpm',
    sfxPrompts: [
      { prompt: 'subtle heartbeat under music', duration: 8, startAt: 1 },
      { prompt: 'muffled dance music from indoors', duration: 6, startAt: 0 },
      { prompt: 'cold night breeze and fabric movement', duration: 5, startAt: 4 },
    ],
  },
  {
    id: 'train-station-goodbye',
    title: 'Train station goodbye',
    description:
      'A farewell on a platform where the loud world fades and every second feels heavy.',
    mood: 'melancholic',
    era: 'timeless',
    intensity: 'high',
    motifs: ['train rumble', 'echo piano', 'held breath'],
    sonicPalette: ['neo-classical piano', 'sub-bass swell', 'ambient field recording'],
    soundtrackPrompt:
      'neo-classical cinematic score, aching and restrained, sparse piano and low ambient swells, unresolved emotion, 70 bpm',
    sfxPrompts: [
      { prompt: 'distant train platform ambience', duration: 10, startAt: 0 },
      { prompt: 'train rumble approaching slowly', duration: 7, startAt: 2 },
      { prompt: 'single exhale close microphone', duration: 2, startAt: 5 },
    ],
  },
  {
    id: 'childhood-summer-rooftop',
    title: 'Childhood rooftop summer',
    description:
      'Warm rooftop evenings, cousins laughing, orange skies, and the sleepy feeling of a perfect summer.',
    mood: 'nostalgic',
    era: 'childhood',
    intensity: 'medium',
    motifs: ['cassette warmth', 'children laughing', 'distant kite wind'],
    sonicPalette: ['lo-fi strings', 'soft guitar', 'analog haze'],
    soundtrackPrompt:
      'nostalgic lo-fi cinematic, wistful guitar and dusty strings, sunset glow, memory-softened rhythm, 74 bpm',
    sfxPrompts: [
      { prompt: 'children laughing far away', duration: 4, startAt: 2 },
      { prompt: 'warm summer rooftop ambience', duration: 10, startAt: 0 },
      { prompt: 'light wind over concrete rooftops', duration: 6, startAt: 1 },
    ],
  },
  {
    id: 'breakthrough-alone-at-night',
    title: 'Alone but becoming',
    description:
      'A solitary late-night breakthrough where the pain is still there, but hope finally arrives.',
    mood: 'hopeful',
    era: 'modern',
    intensity: 'medium',
    motifs: ['soft synth swell', 'pen scribble', 'distant thunder'],
    sonicPalette: ['ambient piano', 'modern score synths', 'slow build percussion'],
    soundtrackPrompt:
      'ambient cinematic build, intimate piano opening into uplifting synth textures, resilient and quietly triumphant, 76 bpm',
    sfxPrompts: [
      { prompt: 'soft room tone at 2am', duration: 8, startAt: 0 },
      { prompt: 'pen writing on paper close up', duration: 3, startAt: 2 },
      { prompt: 'distant thunder very soft', duration: 4, startAt: 5 },
    ],
  },
];
