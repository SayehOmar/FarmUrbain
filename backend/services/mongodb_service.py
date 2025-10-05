from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]
collection = db[os.getenv("MONGO_COLLECTION")]


def insert_geojson(data):
    return collection.insert_one(data).inserted_id


def get_geojson_by_id(id: str):
    return collection.find_one({"_id": ObjectId(id)})
