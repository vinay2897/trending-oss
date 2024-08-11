import requests
from dotenv import load_dotenv
import os
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)

def make_github_req(url, additional_headers={}, query_params={}):
    github_auth_token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Authorization": "Bearer " + github_auth_token,
        "X-GitHub-Api-Version": "2022-11-28",
        **additional_headers,
    }
    return requests.get(url, headers=headers, params=query_params)


def make_github_graphql_req(query, variables={}, additional_headers={}):
    github_auth_token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Authorization": "Bearer " + github_auth_token,
        "Content-Type": "application/json",
        **additional_headers,
    }
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": query, "variables": variables},
        headers=headers,
    )
    if response.status_code == 200:
        return response
    else:
        raise Exception(response)


def get_repos_by_stars(min_stars=100, first=100, after=""):
    query = """
    query getReposByStar($query: String!, $first: Int, $after: String) {
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
    """

    data = {}
    try:
        result = make_github_graphql_req(
            query=query,
            variables={
                "query": "stars:>{min_stars}".format(min_stars=min_stars),
                "first": first,
                "after": after,
            },
        )
        data = result.json()
        search = data["data"]["search"]

        return search
    except Exception as err:
        logging.error(str(err) + str(data))
        return None