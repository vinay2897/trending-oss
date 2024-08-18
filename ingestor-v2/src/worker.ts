import { Worker, Job } from "bullmq";
import { IngestorJob } from "./producer";
import {
  createTimeSeriesCollection,
  getMongoClient,
  insertDocuments,
} from "./mongoClient";
import { getRepos } from "./githubApis";
import { CONCURRENCY } from "./constants";
import { prepareDocument } from "./utils";

const client = getMongoClient();

export const startWorkers = async () => {
  client.connect();
  await createTimeSeriesCollection(client);

  return new Worker(
    "repos",
    async (job: Job) => {
      await startJob(job.data);
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
      concurrency: CONCURRENCY,
    },
  );
};

const startJob = async (job: IngestorJob) => {
  const pageSize = 100;

  let after = "";

  while (true) {
    const result = await getRepos(job.searchFilter, pageSize, after);
    const {
      search: { edges, pageInfo },
      ratelimit,
    } = result;

    const docs = edges.map((edge: unknown) => prepareDocument(edge));
    if (docs.length) {
      await insertDocuments(client, docs);
    }

    console.log(ratelimit);
    after = pageInfo?.endCursor;
    if (!after) {
      break;
    }
  }
};

startWorkers();
