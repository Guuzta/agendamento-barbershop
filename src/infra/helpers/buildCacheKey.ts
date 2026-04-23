type Params = Record<string, any>;

export function buildCacheKey(prefix: string, params?: Params): string {
  if (!params) return prefix;

  const normalized = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join(":");

  return normalized ? `${prefix}:${normalized}` : prefix;
}
