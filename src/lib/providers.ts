import type { GeneratedAsset } from '@/lib/types';

function svgDataUrl(label: string, accent: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><rect width="100%" height="100%" fill="#09090f"/><circle cx="600" cy="600" r="380" fill="${accent}" fill-opacity="0.2"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="56">${label}</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#b4b4c7" font-family="Arial" font-size="28">Demo audio placeholder</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function createMockAsset(kind: 'music' | 'sfx', label: string, prompt: string, duration: number, startAt = 0, debug?: string): Promise<GeneratedAsset> {
  return {
    kind,
    label,
    prompt,
    duration,
    startAt,
    status: 'mock',
    debug,
    url: svgDataUrl(label, kind === 'music' ? '#7c3aed' : '#22c55e'),
  };
}

async function elevenlabsFetch(path: string, body: unknown) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return { ok: false, error: 'Missing ELEVENLABS_API_KEY' };

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
    return {
      ok: false,
      error: `ElevenLabs ${path} returned ${response.status}: ${await response.text()}`,
    };
  }

  if (contentType.includes('audio/')) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return { ok: true, data: `data:${contentType};base64,${buffer.toString('base64')}` };
  }

  return { ok: true, data: await response.json() };
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
  const result = await elevenlabsFetch('/v1/music', {
    prompt,
    music_length_ms: 18000,
  });

  if (!result.ok) {
    return createMockAsset('music', 'Cinematic Score', prompt, 18, 0, result.error);
  }

  const audioUrl = extractAudioUrl(result.data);
  if (!audioUrl) {
    return createMockAsset('music', 'Cinematic Score', prompt, 18, 0, `Unexpected ElevenLabs music response: ${JSON.stringify(result.data).slice(0, 300)}`);
  }

  return {
    kind: 'music',
    label: 'Cinematic Score',
    prompt,
    duration: 18,
    startAt: 0,
    status: 'ready',
    url: audioUrl,
  };
}

export async function generateSfx(prompt: string, duration: number, startAt: number, index: number): Promise<GeneratedAsset> {
  const result = await elevenlabsFetch('/v1/sound-generation', {
    text: prompt,
    duration_seconds: duration,
  });

  if (!result.ok) {
    return createMockAsset('sfx', `Scene FX ${index + 1}`, prompt, duration, startAt, result.error);
  }

  const audioUrl = extractAudioUrl(result.data);
  if (!audioUrl) {
    return createMockAsset('sfx', `Scene FX ${index + 1}`, prompt, duration, startAt, `Unexpected ElevenLabs SFX response: ${JSON.stringify(result.data).slice(0, 300)}`);
  }

  return {
    kind: 'sfx',
    label: `Scene FX ${index + 1}`,
    prompt,
    duration,
    startAt,
    status: 'ready',
    url: audioUrl,
  };
}
