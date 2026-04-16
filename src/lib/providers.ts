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

export async function generateMusic(prompt: string): Promise<GeneratedAsset> {
  if (!process.env.ELEVENLABS_API_KEY) {
    return createMockAsset('music', 'Cinematic Score', prompt, 18, 0);
  }

  return {
    kind: 'music',
    label: 'Cinematic Score',
    prompt,
    duration: 18,
    startAt: 0,
    url: 'https://example.com/replace-with-elevenlabs-music-url',
  };
}

export async function generateSfx(prompt: string, duration: number, startAt: number, index: number): Promise<GeneratedAsset> {
  if (!process.env.ELEVENLABS_API_KEY) {
    return createMockAsset('sfx', `Scene FX ${index + 1}`, prompt, duration, startAt);
  }

  return {
    kind: 'sfx',
    label: `Scene FX ${index + 1}`,
    prompt,
    duration,
    startAt,
    url: `https://example.com/replace-with-elevenlabs-sfx-url/${uid('sfx')}`,
  };
}
