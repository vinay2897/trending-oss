import { config } from "dotenv";
config();

export const prepareDocument = (row: any) => {
    const repo = row["node"]
    const now = new Date()
    return {
        "u": repo.url,
        "ts": now,
        "s": repo.stargazerCount,
        "f": repo.forkCount,
        "w": repo.watchers.totalCount,
    }
};