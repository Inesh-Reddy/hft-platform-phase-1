import { createClient, RedisClientType } from "redis";

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

// connect once when this package is imported
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();

export default redisClient;
