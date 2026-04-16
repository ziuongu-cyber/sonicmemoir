# SonicMemoir

Your life memories, now with Hollywood soundtracks.

## What this MVP does

- Turns a written memory into a cinematic scene record
- Infers mood, era, intensity, and tags
- Retrieves similar public emotional archetypes
- Carries forward recurring sonic motifs from prior memories in the same local session
- Generates one soundtrack prompt and several timed SFX prompts
- Stores memories in a local JSON file so a Life Album timeline builds over time
- Includes share and fetch endpoints
- Works without API keys in demo mode

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Zod
- Local JSON persistence for MVP

## Routes

- `/` home + generator + timeline
- `/memory/[id]` memory playback detail page
- `/api/generate` create memory scene
- `/api/memory/[id]` fetch stored memory JSON
- `/api/share/[id]` fetch share payload

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill values if you want to wire real providers.

## Provider notes

This repo currently includes a clean abstraction layer in `src/lib/providers.ts`.
If `ELEVENLABS_API_KEY` is missing, the app returns mock placeholder assets so the full UX still works.

## Turbopuffer integration plan

Right now public archetype retrieval is implemented in-memory so the product is demoable instantly.
To swap in Turbopuffer:

1. Seed a public namespace with archetype docs and embeddings
2. Query hybrid vector + full text with filters for mood, era, intensity
3. Store generated user memories in a private namespace keyed by session or user id
4. Pull prior user motifs from private results before generation

## ElevenLabs integration plan

Swap the mocked provider methods with:

- Music API call for soundtrack generation
- Multiple parallel SFX generation calls
- Return signed or uploaded audio URLs
- Mix and trim in browser or in a lightweight edge function

## Nice next steps

- Real audio playback and layer mixing with Web Audio API
- TikTok style 15-second export
- Rich waveform rendering from actual audio buffers
- Turbopuffer live retrieval
- OG image/share cards
- Session restore and export/import


trigger deploy 2026-04-16T21:29:01Z
