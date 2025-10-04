"use client";

import React, { useEffect, useState } from "react";

interface UrbanFarmBusinessPageProps {
  goBack: () => void;
}

const UrbanFarmBusinessPage: React.FC<UrbanFarmBusinessPageProps> = ({
  goBack,
}) => {
  const availableLands = [
    {
      id: 1,
      name: "City Center Rooftop",
      coords: [36.8065, 10.1815],
      size: "200 sqm",
      price: "$500/month",
    },
    {
      id: 2,
      name: "Suburb Lot",
      coords: [36.8625, 10.1956],
      size: "500 sqm",
      price: "$800/month",
    },
    {
      id: 3,
      name: "Industrial Park Plot",
      coords: [36.7721, 10.151],
      size: "1000 sqm",
      price: "$1200/month",
    },
  ];

  const [map, setMap] = useState<any>(null);
  const [filteredLands, setFilteredLands] = useState(availableLands);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || map) return;

    // Dynamically import Leaflet only on client side
    import("leaflet").then((L) => {
      // Fix Leaflet default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const mapInstance = L.map("map-urban-farm").setView(
        [36.8065, 10.1815],
        12
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      setMap(mapInstance);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!map || !isClient) return;

    import("leaflet").then((L) => {
      const markers: any[] = [];

      filteredLands.forEach((land) => {
        const marker = L.marker(land.coords as [number, number]).addTo(map);
        marker.on("click", () => {
          setSelectedLand(land);
          setShowPanel(true);
        });
        markers.push(marker);
      });

      return () => {
        markers.forEach((marker) => marker.remove());
      };
    });
  }, [map, filteredLands, isClient]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = availableLands.filter((land) =>
      land.name.toLowerCase().includes(searchTerm)
    );
    setFilteredLands(filtered);
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
      <div id="map-urban-farm" className="absolute inset-0 w-full h-full"></div>

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

          <h2 className="text-2xl font-bold mb-6 mt-8">Available Lands</h2>

          <input
            type="text"
            placeholder="Search lands..."
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {selectedLand ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-3">{selectedLand.name}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Size:</span>{" "}
                  {selectedLand.size}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Price:</span>{" "}
                  {selectedLand.price}
                </p>
              </div>
              <button className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold">
                Confirm Rental
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
              <p>Click on a marker on the map to see land details</p>
            </div>
          )}

          {/* List of all lands */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">All Available Lands</h3>
            <div className="space-y-2">
              {filteredLands.map((land) => (
                <div
                  key={land.id}
                  onClick={() => {
                    setSelectedLand(land);
                    if (map) {
                      map.setView(land.coords, 15);
                    }
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <p className="font-semibold">{land.name}</p>
                  <p className="text-sm text-gray-600">
                    {land.size} • {land.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrbanFarmBusinessPage;
