import redis from "./redisClient";

export const cache = {
  async get(key: string) {
    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);
  },

  async set(key: string, value: any, ttl: number) {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  },

  async del(key: string) {
    await redis.del(key);
  },
};
