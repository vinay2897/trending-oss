import datetime
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

DATE_FORMAT = '%Y-%m-%dT%H:%M:%SZ'
NAME_KEY = "name"
PRIMARY_LANG_KEY = "primaryLanguage"
OWNER_KEY = "owner"
URL_KEY = "url"
DATABASE_ID = "databaseId"
CREATED_AT_KEY = "createdAt"
UPDATED_AT_KEY = "updatedAt"
METADATA_KEY = "metadata"
TIMESTAMP_KEY = "timestamp"
WATCHERS_KEY = "watchers"
STARS_COUNT_KEY = "stargazerCount"
FORK_COUNT_KEY = "forkCount"
WATCHERS_COUNT_KEY = "watchersCount"

def prepare_document(edge):
    repo = edge["node"]
    now = datetime.datetime.now()
    document = {}
    metadata = {}

    metadata[NAME_KEY] = repo[NAME_KEY]
    metadata[PRIMARY_LANG_KEY] = (
        repo[PRIMARY_LANG_KEY][NAME_KEY] if repo[PRIMARY_LANG_KEY] != None else ""
    )
    metadata[OWNER_KEY] = repo[OWNER_KEY]["__typename"]
    metadata[URL_KEY] = repo[URL_KEY]
    metadata[CREATED_AT_KEY] = datetime.datetime.strptime(repo[CREATED_AT_KEY], DATE_FORMAT)

    document[TIMESTAMP_KEY] = now
    document[METADATA_KEY] = metadata
    document[UPDATED_AT_KEY] = datetime.datetime.strptime(repo[UPDATED_AT_KEY], DATE_FORMAT)
    document[STARS_COUNT_KEY] = repo[STARS_COUNT_KEY]
    document[FORK_COUNT_KEY] = repo[FORK_COUNT_KEY]
    document[WATCHERS_COUNT_KEY] = repo[WATCHERS_KEY]["totalCount"]

    return document