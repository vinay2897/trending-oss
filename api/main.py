import os
from fastapi import FastAPI
import mongo_client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "test" }