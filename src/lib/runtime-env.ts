type RuntimeLike = {
  ELEVENLABS_API_KEY?: string;
  TURBOPUFFER_API_KEY?: string;
  NEXT_PUBLIC_APP_URL?: string;
};

function fromProcessEnv(key: keyof RuntimeLike) {
  if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
    return process.env[key] as string;
  }
  return undefined;
}

function fromGlobalThis(key: keyof RuntimeLike) {
  const globalValue = (globalThis as Record<string, unknown>)[key];
  return typeof globalValue === 'string' ? globalValue : undefined;
}

export function getRuntimeEnv(key: keyof RuntimeLike) {
  return fromProcessEnv(key) ?? fromGlobalThis(key) ?? undefined;
}
