import { getRateLimit, getRepos } from "../githubApis";
import { config } from "dotenv";
config();

describe("githubApis", () => {
  it("getRepos", async () => {
    const result = await getRepos("size:>10", 1);
    expect(result.search.edges.length).toEqual(1);
  });

  it.only("getRateLimit", async () => {
    const result = await getRateLimit();
    console.log(result);
    expect(result).toEqual(
      expect.objectContaining({
        resetAt: expect.any(String),
        remaining: expect.any(Number),
        limit: expect.any(Number),
      }),
    );
  });
});
