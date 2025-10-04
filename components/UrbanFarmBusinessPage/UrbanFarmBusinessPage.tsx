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
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-8">
        Urban-Farm Business - Find Your Land
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Available Lands</h2>
          <input
            type="text"
            placeholder="Search lands..."
            onChange={handleSearch}
            className="w-full p-2 border rounded mb-4"
          />
          {selectedLand ? (
            <div>
              <h3 className="text-xl font-bold">{selectedLand.name}</h3>
              <p>Size: {selectedLand.size}</p>
              <p>Price: {selectedLand.price}</p>
              <button className="w-full mt-4 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                Confirm Rental
              </button>
            </div>
          ) : (
            <p>Select a land on the map to see details.</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Map of Available Lands</h2>
          <div id="map-urban-farm" style={{ height: "60vh" }}></div>
        </div>
      </div>
    </div>
  );
};

export default UrbanFarmBusinessPage;
