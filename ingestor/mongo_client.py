from pymongo import MongoClient
from dotenv import load_dotenv
from main import TIMESTAMP_KEY, METADATA_KEY
import os
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)

uri = "mongodb://{username}:{password}@{host}:{port}".format(
    username=os.getenv("MONGO_USER"),
    password=os.getenv("MONGO_PASSWORD"),
    host=os.getenv("MONGO_HOST"),
    port=os.getenv("MONGO_PORT"),
)

COLLECTION_NAME = "repos"

def get_mongo_client():
    return MongoClient(uri)

def create_collection(client):
    try:
        db = client.test
        collections = db.list_collection_names()
        if COLLECTION_NAME in collections:
            logging.info("collection already exists, skippping creation")
            return

        db.create_collection(
            COLLECTION_NAME,
            timeseries={
                "timeField": "ts",
                # "metaField": "u",
                "granularity": "hours",
            },
        )
    except Exception as e:
        logging.error("Error creating collection" + str(e))


def insert_documents(client, documents):
    try:
        db = client.test
        db[COLLECTION_NAME].insert_many(documents)
    except Exception as e:
        logging.error("Error inserting documents" + str(e))
