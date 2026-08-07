import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // Thử lại sau mỗi 2 giây
  },
});

redisClient.on("connect", () => {
  console.log(" Redis client connected successfully.");
});

redisClient.on("error", (err) => {
  console.error(" Redis connection error:", err);
});
