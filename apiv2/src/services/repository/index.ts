import { MongoClient } from 'mongodb';
import { GetRepos } from '../../validators/repository';
import moment from 'moment';

export const getRepos = async (dbClient: MongoClient, payload: GetRepos) => {
  const db = dbClient.db(process.env.MONGO_DATABASE);
  const reposCollection = db.collection('repos');

  const since = moment().subtract(1, 'days').toDate();

  return await reposCollection
    .aggregate([
      { $match: { ts: { $gte: since } } },
      {
        $setWindowFields: {
          partitionBy: '$u',
          sortBy: { ts: 1 },
          output: {
            previous: {
              $shift: {
                output: '$s',
                by: 1,
                default: null,
              },
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $ne: [{ $subtract: ['$s', '$previous'] }, 0],
          },
        },
      },
      { $project: { lag: 1, u: 1, ts: 1 } },
    ])
    .toArray();
};

