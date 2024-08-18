import { Queue } from "bullmq";

export const reposQueue = new Queue("repos", {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});
