import sys
import os
from qgis.core import QgsApplication


def setup_qgis():
    """
    Initialize QGIS in standalone mode for use within FastAPI or any non-QGIS environment.
    Returns a QgsApplication instance.
    """

    # === Path to your QGIS installation (adjust if needed) ===
    QGIS_PREFIX_PATH = r"C:\Program Files\QGIS 3.24.2\apps\qgis"
    PYTHON_PATH = r"C:\Program Files\QGIS 3.24.2\apps\Python39"

    # === Set environment variables ===
    os.environ["QGIS_PREFIX_PATH"] = QGIS_PREFIX_PATH
    os.environ["QT_QPA_PLATFORM"] = "offscreen"  # Avoid GUI issues on servers

    # === Append QGIS Python paths ===
    sys.path.append(os.path.join(QGIS_PREFIX_PATH, "python"))
    sys.path.append(PYTHON_PATH)

    # === Initialize QGIS Application ===
    qgs = QgsApplication([], False)
    qgs.setPrefixPath(QGIS_PREFIX_PATH, True)
    qgs.initQgis()

    print("✅ QGIS environment initialized successfully.")
    return qgs


def exit_qgis(qgs: QgsApplication):
    """Cleanly exit the QGIS environment."""
    qgs.exitQgis()
    print("🧹 QGIS environment closed.")
