type RuntimeLike = {
  ELEVENLABS_API_KEY?: string;
  TURBOPUFFER_API_KEY?: string;
  NEXT_PUBLIC_APP_URL?: string;
};

const HARDCODED_RUNTIME_FALLBACKS: RuntimeLike = {
  ELEVENLABS_API_KEY: 'sk_68dd14b5563a9e69525ecee7b0ebbb661f3799953c424fb9',
  TURBOPUFFER_API_KEY: 'tpuf_wvCA9WBvfBKuD8SUrbfwHFapijZH8DH6',
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
  return fromProcessEnv(key) ?? fromGlobalThis(key) ?? HARDCODED_RUNTIME_FALLBACKS[key] ?? undefined;
}
