import { countRepos, getRepos } from "./githubApis";
import moment from "moment";
import pino from "pino";
import fs from "fs";
import chunk from "lodash/chunk";
import { FOLDER, TWO_DAYS } from "./constants";
import { YearJob } from "./types";

const logger = pino({
  level: process.env.DEBUG ? "debug" : undefined,
  transport: {
    target: "pino-pretty",
    options: {
      messageFormat: false,
    },
  },
});



export const preprocessJobs = async (
  minStars: number,
  restrictYears: number[],
) => {
  const years = restrictYears || [];
  if (!years.length) {
    for (let i = 2008; i < moment().year() + 1; i++) {
      years.push(i);
    }
  }

  const chunks = chunk(years, 4);

  for (const yearsChunk of chunks) {
    await Promise.all(
      yearsChunk.map((year) => preprocessJobsByYear(minStars, year)),
    );
  }
};

const preprocessJobsByYear = async (minStars: number, year: number) => {
  const startMoment = moment.utc(`${year}-01-01`);
  const endMoment = moment.utc(`${year}-12-31`);

  const searchQuery = `stars:>${minStars} created:${startMoment.toISOString()}..${endMoment.toISOString()}`;
  const { search: initial } = await getRepos(searchQuery, 1);
  const total = initial.repositoryCount;

  let since = startMoment.clone();
  let addSeconds = TWO_DAYS;
  let jobCount = 0;
  let queued = 0;
  const baseFilter = `stars:>${minStars}`;

  const jobs: YearJob[] = [];

  while (true) {
    const from = since.clone();
    let to = since
      .clone()
      .add(addSeconds as moment.DurationInputArg1, "seconds");
    to = to.isAfter(endMoment) ? endMoment : to;

    const query = `${baseFilter} created:${from.toISOString()}..${to.toISOString()}`;
    const { count, ratelimit } = await countRepos(query);

    if (count > 1000) {
      addSeconds = addSeconds * 0.75;
    } else {
      if (count > 750 || to.isSame(endMoment)) {
        jobs.push({
          id: jobCount,
          baseFilter,
          repoCount: count,
          start: from.toISOString(),
          end: to.toISOString(),
        });
        queued = queued + count;
        logger.info({
          timeFilter: `${from.toISOString()} ${to.toISOString()}`,
          year,
          queued: count,
          total: `${queued}/${total}`,
          progress: `${((queued * 100) / total).toFixed(2)}%`,
          ratelimit,
        });
        jobCount++;
        since = to.clone().add(1, "second");
      } else {
        addSeconds = 1.75 * addSeconds;
      }
    }

    if (since.isAfter(endMoment)) {
      break;
    }
  }

  fs.writeFileSync(`${FOLDER}/${year}.json`, JSON.stringify(jobs), {
    flag: "w+",
  });
  return jobs;
};

const minStars = parseInt(process.argv[2]);
const years = process.argv[3]?.split(",").map((y) => parseInt(y));
if (minStars) {
  preprocessJobs(minStars, years);
}
