import sys
from main import get_repos_by_stars
import logging

logging.basicConfig(level=logging.INFO)


def start_job(min_stars, first):
    result = get_repos_by_stars(min_stars=min_stars, first=first)
    if result == None:
        return
    fetchNextPage = result["pageInfo"]["hasNextPage"]

    completed = first
    logging.info("total records:" + str(result["repositoryCount"]))

    while fetchNextPage:
        after = result["pageInfo"]["endCursor"]
        result = get_repos_by_stars(min_stars=min_stars, first=first, after=after)
        if result == None:
            break

        completed = completed + first
        logging.info("completed fetching:" + str(completed))

        fetchNextPage = result["pageInfo"]["hasNextPage"]

if __name__ == "__main__":
    args = sys.argv
    start_job(int(args[1]), int(args[2]))