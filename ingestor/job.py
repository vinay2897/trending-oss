import sys
import time
from main import get_repos_by_stars, prepare_document
from mongo_client import create_collection, get_mongo_client, insert_documents
import logging

logging.basicConfig(level=logging.INFO)


def start_job(min_stars, first):
    mongo_client = get_mongo_client()
    create_collection(mongo_client)

    completed = 0
    after = ""
    while True:
        start_time = time.perf_counter()

        result = get_repos_by_stars(min_stars=min_stars, first=first, after=after)
        if result == None:
            return
        fetchNextPage = result["pageInfo"]["hasNextPage"]

        documents = list(map(prepare_document, result["edges"]))
        insert_documents(mongo_client, documents)

        completed = completed + first
        logging.info("completed:" + str(completed) + "/" + str(result["repositoryCount"]))

        after = result["pageInfo"]["endCursor"]

        end_time = time.perf_counter()
        print("time taken " + str(end_time - start_time) + " secs")

        if fetchNextPage == False:
            break

    mongo_client.close()


if __name__ == "__main__":
    args = sys.argv
    start_job(int(args[1]), int(args[2]))
