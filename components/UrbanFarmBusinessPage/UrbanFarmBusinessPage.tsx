"use client";

import React, { useEffect, useState } from "react";

interface LandownerPageProps {
  goBack: () => void;
}

interface DrawingMetadata {
  id: string;
  name: string;
  size: string;
  landType: string;
  price: string;
  description: string;
  geojson: any;
}

const LandownerPage: React.FC<LandownerPageProps> = ({ goBack }) => {
  const [map, setMap] = useState<any>(null);
  const [drawnItems, setDrawnItems] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [drawings, setDrawings] = useState<DrawingMetadata[]>([]);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [expandedDrawing, setExpandedDrawing] = useState<string | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState({
    name: "",
    size: "",
    landType: "rooftop",
    price: "",
    description: "",
  });

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
    if (!drawnItems) return;

    const layers = drawnItems.getLayers();
    if (layers.length === 0) {
      alert("Please draw at least one polygon on the map.");
      return;
    }

    // Open panel and show metadata dialog
    setShowPanel(true);
    setShowMetadataDialog(true);

    // Reset form
    setCurrentMetadata({
      name: "",
      size: "",
      landType: "rooftop",
      price: "",
      description: "",
    });
  };

  const handleSaveMetadata = () => {
    if (
      !currentMetadata.name ||
      !currentMetadata.size ||
      !currentMetadata.price
    ) {
      alert("Please fill in all required fields (Name, Size, Price)");
      return;
    }

    const geojson = drawnItems.toGeoJSON();
    const layers = drawnItems.getLayers();

    // Create metadata for each drawn shape
    const newDrawings: DrawingMetadata[] = layers.map(
      (layer: any, index: number) => {
        const layerGeoJSON = layer.toGeoJSON();
        return {
          id: `drawing-${Date.now()}-${index}`,
          ...currentMetadata,
          geojson: layerGeoJSON,
        };
      }
    );

    setDrawings([...drawings, ...newDrawings]);
    setShowMetadataDialog(false);

    // Clear the drawn items from map
    drawnItems.clearLayers();

    alert(`${newDrawings.length} land parcel(s) saved successfully!`);
  };

  const handleExportDrawing = (drawing: DrawingMetadata) => {
    const dataStr = JSON.stringify(drawing, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${drawing.name.replace(/\s+/g, "_")}_land.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    if (drawings.length === 0) {
      alert("No drawings to export");
      return;
    }

    const allData = {
      type: "FeatureCollection",
      features: drawings.map((d) => ({
        ...d.geojson,
        properties: {
          name: d.name,
          size: d.size,
          landType: d.landType,
          price: d.price,
          description: d.description,
        },
      })),
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `all_land_parcels_${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteDrawing = (id: string) => {
    if (confirm("Are you sure you want to delete this land parcel?")) {
      setDrawings(drawings.filter((d) => d.id !== id));
    }
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

          {/* Metadata Dialog */}
          {showMetadataDialog && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">Add Land Details</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentMetadata.name}
                    onChange={(e) =>
                      setCurrentMetadata({
                        ...currentMetadata,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., City Center Rooftop"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentMetadata.size}
                    onChange={(e) =>
                      setCurrentMetadata({
                        ...currentMetadata,
                        size: e.target.value,
                      })
                    }
                    placeholder="e.g., 200 sqm"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentMetadata.landType}
                    onChange={(e) =>
                      setCurrentMetadata({
                        ...currentMetadata,
                        landType: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="rooftop">Rooftop</option>
                    <option value="vacant">Vacant Lot</option>
                    <option value="industrial">Industrial Plot</option>
                    <option value="residential">Residential Yard</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (per month) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentMetadata.price}
                    onChange={(e) =>
                      setCurrentMetadata({
                        ...currentMetadata,
                        price: e.target.value,
                      })
                    }
                    placeholder="e.g., $500/month"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={currentMetadata.description}
                    onChange={(e) =>
                      setCurrentMetadata({
                        ...currentMetadata,
                        description: e.target.value,
                      })
                    }
                    placeholder="Additional details about the land..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSaveMetadata}
                  className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold"
                >
                  Save Land
                </button>
                <button
                  onClick={() => setShowMetadataDialog(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Saved Drawings List */}
          {drawings.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">
                  Saved Land Parcels ({drawings.length})
                </h3>
                <button
                  onClick={handleExportAll}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Export All
                </button>
              </div>

              <div className="space-y-2">
                {drawings.map((drawing) => (
                  <div
                    key={drawing.id}
                    className="border border-gray-300 rounded-lg overflow-hidden"
                  >
                    {/* Collapse Header */}
                    <button
                      onClick={() =>
                        setExpandedDrawing(
                          expandedDrawing === drawing.id ? null : drawing.id
                        )
                      }
                      className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{drawing.name}</p>
                        <p className="text-sm text-gray-600">
                          {drawing.size} • {drawing.price}
                        </p>
                      </div>
                      <span className="text-gray-500">
                        {expandedDrawing === drawing.id ? "▼" : "▶"}
                      </span>
                    </button>

                    {/* Collapse Content */}
                    {expandedDrawing === drawing.id && (
                      <div className="p-3 bg-white border-t">
                        <div className="space-y-2 text-sm mb-3">
                          <p>
                            <span className="font-semibold">Type:</span>{" "}
                            {drawing.landType}
                          </p>
                          <p>
                            <span className="font-semibold">Description:</span>{" "}
                            {drawing.description || "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExportDrawing(drawing)}
                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Export GeoJSON
                          </button>
                          <button
                            onClick={() => handleDeleteDrawing(drawing.id)}
                            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Drawing Instructions */}
            {!showMetadataDialog && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  📍 How to Mark Your Land
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Use the drawing tools on the left side of the map</li>
                  <li>Draw polygons or rectangles around your property</li>
                  <li>Click "Confirm Drawing" when finished</li>
                  <li>Fill in the metadata for your land parcels</li>
                </ol>
              </div>
            )}

            {/* Confirm Drawing Button */}
            {!showMetadataDialog && (
              <button
                onClick={handleConfirmDrawing}
                className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold shadow-md"
              >
                ✓ Confirm Drawing
              </button>
            )}

            {/* Divider */}
            {!showMetadataDialog && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
            )}

            {/* Shapefile Upload Section */}
            {!showMetadataDialog && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandownerPage;
