import subprocess
import os
import sys


def run_qgis_analysis(geojson_id: str):
    """
    Launch the QGIS processing script for a given GeoJSON ID in a separate process.
    This allows FastAPI to return immediately without blocking.
    """
    # Absolute path to the worker script
    script_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../qgis_worker/run_analysis.py")
    )

    # Use the same Python executable that runs FastAPI
    python_exe = sys.executable

    try:
        subprocess.Popen([python_exe, script_path, geojson_id])
        print(f"🚀 QGIS analysis started for GeoJSON ID: {geojson_id}")
    except Exception as e:
        print(f"❌ Failed to start QGIS analysis: {e}")
