import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient("mongodb://{user}:{password}@{host}:{port}".format(
    user=os.getenv("MONGO_USER"),
    password=os.getenv("MONGO_PASSWORD"),
    host=os.getenv("MONGO_HOST"),
    port=os.getenv("MONGO_PORT")
))

db = client[os.getenv("MONGO_DATABASE")]