import type { GeneratedAsset } from '@/lib/types';
import { uid } from '@/lib/utils';

function svgDataUrl(label: string, accent: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><rect width="100%" height="100%" fill="#09090f"/><circle cx="600" cy="600" r="380" fill="${accent}" fill-opacity="0.2"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="56">${label}</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#b4b4c7" font-family="Arial" font-size="28">Demo audio placeholder</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function createMockAsset(kind: 'music' | 'sfx', label: string, prompt: string, duration: number, startAt = 0): Promise<GeneratedAsset> {
  return {
    kind,
    label,
    prompt,
    duration,
    startAt,
    url: svgDataUrl(label, kind === 'music' ? '#7c3aed' : '#22c55e'),
  };
}

async function elevenlabsFetch(path: string, body: unknown) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(`https://api.elevenlabs.io${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ElevenLabs error ${response.status}: ${text}`);
  }

  if (contentType.includes('audio/')) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  }

  return response.json();
}

function extractAudioUrl(response: unknown): string | null {
  if (!response) return null;
  if (typeof response === 'string') return response;
  if (typeof response !== 'object') return null;

  const candidate = response as Record<string, unknown>;
  return (
    (typeof candidate.audio_url === 'string' && candidate.audio_url) ||
    (typeof candidate.url === 'string' && candidate.url) ||
    (typeof candidate.audio === 'string' && candidate.audio) ||
    null
  );
}

export async function generateMusic(prompt: string): Promise<GeneratedAsset> {
  if (!process.env.ELEVENLABS_API_KEY) {
    return createMockAsset('music', 'Cinematic Score', prompt, 18, 0);
  }

  try {
    const response = await elevenlabsFetch('/v1/music', {
      prompt,
      music_length_ms: 18000,
    });
    const audioUrl = extractAudioUrl(response);
    if (!audioUrl) throw new Error('No music audio returned');

    return {
      kind: 'music',
      label: 'Cinematic Score',
      prompt,
      duration: 18,
      startAt: 0,
      url: audioUrl,
    };
  } catch {
    return createMockAsset('music', 'Cinematic Score', prompt, 18, 0);
  }
}

export async function generateSfx(prompt: string, duration: number, startAt: number, index: number): Promise<GeneratedAsset> {
  if (!process.env.ELEVENLABS_API_KEY) {
    return createMockAsset('sfx', `Scene FX ${index + 1}`, prompt, duration, startAt);
  }

  try {
    const response = await elevenlabsFetch('/v1/sound-generation', {
      text: prompt,
      duration_seconds: duration,
    });
    const audioUrl = extractAudioUrl(response);
    if (!audioUrl) throw new Error('No SFX audio returned');

    return {
      kind: 'sfx',
      label: `Scene FX ${index + 1}`,
      prompt,
      duration,
      startAt,
      url: audioUrl,
    };
  } catch {
    return createMockAsset('sfx', `Scene FX ${index + 1}`, prompt, duration, startAt);
  }
}
