const memoryCache = new Map();

export function getCached(key) {
  const row = memoryCache.get(key);
  if (!row) return null;
  if (row.expireAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return row.value;
}

export function setCached(key, value, ttlMs = 120000) {
  memoryCache.set(key, { value, expireAt: Date.now() + ttlMs });
}

export async function withCache(key, fn, ttlMs = 120000) {
  const cached = getCached(key);
  if (cached) return cached;
  const value = await fn();
  setCached(key, value, ttlMs);
  return value;
}
