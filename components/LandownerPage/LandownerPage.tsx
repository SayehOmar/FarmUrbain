"use client";

import React, { useEffect, useState } from "react";

interface LandownerPageProps {
  goBack: () => void;
}

const LandownerPage: React.FC<LandownerPageProps> = ({ goBack }) => {
  const [map, setMap] = useState<any>(null);
  const [drawnItems, setDrawnItems] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || map) return;

    Promise.all([import("leaflet"), import("leaflet-draw")])
      .then(([L]) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const mapInstance = L.map("map-landowner").setView(
          [36.8065, 10.1815],
          12
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapInstance);
        setMap(mapInstance);

        const drawnItemsLayer = new L.FeatureGroup();
        mapInstance.addLayer(drawnItemsLayer);
        setDrawnItems(drawnItemsLayer);

        const drawControl = new (L.Control as any).Draw({
          edit: {
            featureGroup: drawnItemsLayer,
          },
          draw: {
            polygon: true,
            polyline: false,
            rectangle: true,
            circle: false,
            marker: false,
            circlemarker: false,
          },
        });
        mapInstance.addControl(drawControl);

        // Use string event name instead of L.Draw.Event
        mapInstance.on("draw:created", (event: any) => {
          const layer = event.layer;
          drawnItemsLayer.addLayer(layer);
        });
      })
      .catch((error) => {
        console.error("Error loading Leaflet or Leaflet Draw:", error);
      });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isClient, map]);

  const handleConfirmDrawing = () => {
    const geojson = drawnItems.toGeoJSON();
    console.log(geojson);
    alert("Drawing confirmed! Check the console for the GeoJSON data.");
  };

  const handleShapefileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Shapefile "${file.name}" submitted.`);
      // Here you would typically process the shapefile
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen Map */}
      <div id="map-landowner" className="absolute inset-0 w-full h-full"></div>

      {/* Go Back Button - Top Left */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 z-[1000] px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      >
        ← Go Back
      </button>

      {/* Toggle Panel Button - Right Side */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-[1000] p-3 bg-green-700 text-white rounded-lg shadow-lg opacity-30 hover:opacity-100 transition-opacity duration-300"
      >
        {showPanel ? "→" : "←"}
      </button>

      {/* Sliding Right Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          {/* Close Button Inside Panel */}
          <button
            onClick={() => setShowPanel(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 mt-8">Submit Your Land</h2>

          <div className="space-y-6">
            {/* Drawing Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                📍 How to Mark Your Land
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Use the drawing tools on the left side of the map</li>
                <li>Draw a polygon or rectangle around your property</li>
                <li>Click "Confirm Drawing" when finished</li>
              </ol>
            </div>

            {/* Confirm Drawing Button */}
            <button
              onClick={handleConfirmDrawing}
              className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold shadow-md"
            >
              ✓ Confirm Drawing
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Shapefile Upload Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                📂 Upload Shapefile
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Already have your land boundaries in a shapefile? Upload it
                here.
              </p>

              <label
                htmlFor="shapefile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Shapefile (.shp, .shx, .dbf)
              </label>
              <input
                id="shapefile"
                type="file"
                onChange={handleShapefileUpload}
                accept=".shp,.shx,.dbf"
                multiple
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-green-700 file:text-white 
                  hover:file:bg-green-800 
                  file:cursor-pointer
                  cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2">
                You can select multiple files (.shp, .shx, .dbf, .prj)
              </p>
            </div>

            {/* Additional Information */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">
                💡 What Happens Next?
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Your land will be reviewed by our team</li>
                <li>• You'll receive a confirmation within 24-48 hours</li>
                <li>
                  • Once approved, your land will be listed for urban farmers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandownerPage;
