import Redis from "ioredis";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
export const redisClient = new Redis(redisUrl, {
  // Bắt buộc có phần này vì Upstash yêu cầu bảo mật TLS (rediss://)
  tls: {
    rejectUnauthorized: false,
  },
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

redisClient.on("connect", () => {
  console.log(" Redis client connected successfully.");
});

redisClient.on("error", (err) => {
  console.error(" Redis connection error:", err);
});
