'use client';

import React, { useEffect, useState } from 'react';

const availableLands = [
  { id: 1, name: 'City Center Rooftop', coords: [36.8065, 10.1815], size: '200 sqm', price: '$500/month' },
  { id: 2, name: 'Suburb Lot', coords: [36.8625, 10.1956], size: '500 sqm', price: '$800/month' },
  { id: 3, name: 'Industrial Park Plot', coords: [36.7721, 10.1510], size: '1000 sqm', price: '$1200/month' },
];

const UrbanFarmBusinessPage: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [filteredLands, setFilteredLands] = useState(availableLands);
  const [selectedLand, setSelectedLand] = useState<any>(null);

  useEffect(() => {
    if (map) return;

    const L = require('leaflet');

    const mapInstance = L.map('map-urban-farm').setView([36.8065, 10.1815], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance);
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const L = require('leaflet');
    const markers = L.layerGroup().addTo(map);

    filteredLands.forEach(land => {
      const marker = L.marker(land.coords).addTo(markers);
      marker.on('click', () => {
        setSelectedLand(land);
      });
    });

    return () => {
      markers.clearLayers();
    };
  }, [map, filteredLands]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = availableLands.filter(land => land.name.toLowerCase().includes(searchTerm));
    setFilteredLands(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Urban-Farm Business - Find Your Land</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Available Lands</h2>
          <input type="text" placeholder="Search lands..." onChange={handleSearch} className="w-full p-2 border rounded mb-4" />
          {selectedLand ? (
            <div>
              <h3 className="text-xl font-bold">{selectedLand.name}</h3>
              <p>Size: {selectedLand.size}</p>
              <p>Price: {selectedLand.price}</p>
              <button className="w-full mt-4 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">Confirm Rental</button>
            </div>
          ) : (
            <p>Select a land on the map to see details.</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Map of Available Lands</h2>
          <div id="map-urban-farm" style={{ height: '60vh' }}></div>
        </div>
      </div>
    </div>
  );
};

export default UrbanFarmBusinessPage;