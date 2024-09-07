import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config({ override: true });

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT } = process.env;
const url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

const mongoClient = new MongoClient(url);

export default mongoClient;

// db.repos.aggregate([
//   { $match: {u:"https://github.com/svenfuchs/adva_cms"} },
//   {
//       $setWindowFields: {
//        partitionBy: "$u",
//        sortBy: { ts: 1 },
//        output: {
//           lag: {
//             $shift: {
//               output: "$s",
//               by: -1,
//               default: null
//             }
//           }
//        }
//     }
//   },
//   {
//       $set: { change: { $subtract: ["$s", "$lag"]}}
//   }
// ])

