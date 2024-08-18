import { config } from "dotenv";
config();
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { reposQueue } from "./queues";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(reposQueue)],
  serverAdapter: serverAdapter,
});

const app = express();

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3000, () => {
  console.log("Server started");
});
