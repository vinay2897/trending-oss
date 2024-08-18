import axios from "axios";
import { config } from "dotenv";
config();

export const getRepos = async (
  query: string,
  pageSize: number = 100,
  after: string = "",
) => {
  let resp;
  const token = process.env.GITHUB_TOKEN;
  try {
    resp = await axios.post(
      "https://api.github.com/graphql",
      {
        query: `
        query getRepos($query: String!, $first: Int, $after: String) {
          search(query: $query, type: REPOSITORY, first: $first, after: $after) {
            repositoryCount
            edges {
              node {
                ... on Repository {
                  id
                  databaseId
                  name
                  stargazerCount
                  watchers {
                    totalCount
                  }
                  primaryLanguage {
                    name
                  }
                  owner {
                    __typename
                  }
                  forkCount
                  diskUsage
                  createdAt
                  updatedAt
                  url
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
        `,
        variables: { first: pageSize, after, query },
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      search: resp.data.data.search,
      ratelimit: resp.headers["x-ratelimit-remaining"],
    };
  } catch (err) {
    console.log(resp?.headers, resp?.data, err);
  }
  return { search: null, ratelimit: null };
};

export const countRepos = async (query: string) => {
  let resp;
  const token = process.env.GITHUB_TOKEN;
  try {
    resp = await axios.post(
      "https://api.github.com/graphql",
      {
        query: `
        query countRepos($query: String!) {
          search(query: $query, type: REPOSITORY) {
            repositoryCount
          }
        }
        `,
        variables: { query },
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      count: resp.data.data.search.repositoryCount,
      ratelimit: resp.headers["x-ratelimit-remaining"],
    };
  } catch (err) {
    console.log(resp?.headers, resp?.data, err);
  }
  return { count: null, ratelimit: null };
};

export const getRateLimit = async () => {
  let resp;
  const token = process.env.GITHUB_TOKEN;
  try {
    resp = await axios.post(
      "https://api.github.com/graphql",
      {
        query: `
          query {
            rateLimit {
              limit
              cost
              remaining
              resetAt
            }
          }
        `,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      },
    );

    return resp.data.data.rateLimit;
  } catch (err) {
    console.error(err, resp?.data);
  }
  return null;
};
