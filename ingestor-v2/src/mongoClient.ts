import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT } = process.env;
const url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

const COLLECTION_NAME = "repos";

export const getMongoClient = () => {
  return new MongoClient(url);
};

export const createTimeSeriesCollection = async (client: MongoClient) => {
  const db = client.db("test");

  const collections = await (
    await db.listCollections().toArray()
  ).map(({ name }) => name);
  const exists = collections.find((col) => col === COLLECTION_NAME);
  if (exists) {
    return;
  }

  await db.createCollection(COLLECTION_NAME, {
    timeseries: {
      timeField: "ts",
      granularity: "hours",
    },
    expireAfterSeconds: 30 * 24 * 60 * 60,
  });
};

export const insertDocuments = async (
  client: MongoClient,
  documents: Document[],
) => {
  const db = client.db("test");
  await db.collection(COLLECTION_NAME).insertMany(documents);
};
