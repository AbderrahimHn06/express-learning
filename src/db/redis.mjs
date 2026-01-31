import { createClient } from "redis";
import "dotenv/config";

const redisClientUrl = process.env.REDIS_CLIENT_URL;

export const redis = createClient({
  url: redisClientUrl,
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

await redis.connect();
