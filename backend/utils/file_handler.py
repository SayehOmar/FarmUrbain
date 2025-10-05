import os
import json


def save_geojson_file(geojson_data, filename):
    os.makedirs("uploads", exist_ok=True)
    path = f"uploads/{filename}.geojson"
    with open(path, "w") as f:
        json.dump(geojson_data, f)
    return path
