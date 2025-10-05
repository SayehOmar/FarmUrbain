from qgis.core import (
    QgsRasterLayer,
    QgsRasterCalculator,
    QgsRasterCalculatorEntry,
    QgsProcessingFeedback,
    QgsProject,
)
import os


def preprocess_raster(input_path):
    """Placeholder for atmospheric, radiometric, and normalization corrections."""
    # In real workflows, you might call Sen2Cor or SNAP for physical corrections.
    # Here we just return the same raster path.
    return input_path


def compute_index(output_path, band_math, entries, description):
    calc = QgsRasterCalculator(
        band_math,
        output_path,
        "GTiff",
        entries[0].raster.extent(),
        entries[0].raster.width(),
        entries[0].raster.height(),
        entries,
    )
    calc.processCalculation()
    print(f"{description} created at {output_path}")


def compute_indices(band_paths: dict, out_dir: str):
    """Compute NDVI, NDBI, and NDWI from band paths."""
    os.makedirs(out_dir, exist_ok=True)

    red = QgsRasterLayer(band_paths["red"], "Red")
    nir = QgsRasterLayer(band_paths["nir"], "NIR")
    swir = QgsRasterLayer(band_paths["swir"], "SWIR")
    green = QgsRasterLayer(band_paths["green"], "Green")

    entries = []
    for band, layer in zip(["red", "nir", "swir", "green"], [red, nir, swir, green]):
        e = QgsRasterCalculatorEntry()
        e.ref = f"{band}@1"
        e.raster = layer
        e.bandNumber = 1
        entries.append(e)

    compute_index(
        os.path.join(out_dir, "NDVI.tif"),
        "(nir@1 - red@1) / (nir@1 + red@1)",
        entries,
        "NDVI",
    )
    compute_index(
        os.path.join(out_dir, "NDBI.tif"),
        "(swir@1 - nir@1) / (swir@1 + nir@1)",
        entries,
        "NDBI",
    )
    compute_index(
        os.path.join(out_dir, "NDWI.tif"),
        "(green@1 - nir@1) / (green@1 + nir@1)",
        entries,
        "NDWI",
    )

    print("✅ All indices generated.")
