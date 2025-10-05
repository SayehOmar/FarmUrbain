import sys
import os
from qgis_env_setup import setup_qgis
from process_satellite_data import preprocess_raster, compute_indices
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

geojson_id = sys.argv[1]

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]
collection = db[os.getenv("MONGO_COLLECTION")]

geojson = collection.find_one({"_id": geojson_id})
if not geojson:
    print("❌ GeoJSON not found.")
    sys.exit(1)

print(f"Processing GeoJSON ID: {geojson_id}")

# Setup QGIS environment
qgs = setup_qgis()

# Example: you would locate Sentinel-2 bands here
band_paths = {
    "red": "C:/data/S2_B04.tif",
    "nir": "C:/data/S2_B08.tif",
    "swir": "C:/data/S2_B11.tif",
    "green": "C:/data/S2_B03.tif",
}

out_dir = f"C:/data/results/{geojson_id}"
compute_indices(band_paths, out_dir)

qgs.exitQgis()
print("✅ QGIS processing complete.")
