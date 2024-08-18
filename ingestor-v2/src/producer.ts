import fs from "fs";
import { chunk } from "lodash";
import { reposQueue } from "./queues";
import { FOLDER } from "./constants";
import { YearJob } from "./types";

export type IngestorJob = {
  id: number;
  searchFilter: string;
};

export const createJobs = async () => {
  const filenames = fs.readdirSync(FOLDER);
  let jobs: YearJob[] = [];
  for (const filename of filenames) {
    const yearJobs = JSON.parse(
      fs.readFileSync(`${FOLDER}/${filename}`).toString(),
    );
    jobs = jobs.concat(yearJobs);
  }

  const chunks = chunk(jobs, 500);
  for (const [idx, chunk] of Object.entries(chunks)) {
    for (const { id, baseFilter, start, end } of chunk) {
      await reposQueue.add(
        `${id}_${start}_${end}`,
        {
          id,
          searchFilter: `${baseFilter} created:${start}..${end}`,
        },
        { delay: parseInt(idx) * 2 * 60 * 60 * 1000 },
      );
    }
  }
  console.log("jobs created");
  reposQueue.close();
  return;
};

createJobs();
