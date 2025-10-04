'use client';

import React, { useEffect, useState } from 'react';

interface LandownerPageProps {
  goBack: () => void;
}

const LandownerPage: React.FC<LandownerPageProps> = ({ goBack }) => {
  const [map, setMap] = useState<any>(null);
  const [drawnItems, setDrawnItems] = useState<any>(null);

  useEffect(() => {
    if (map) return;

    const L = require('leaflet');
    require('leaflet-draw');

    const mapInstance = L.map('map-landowner').setView([36.8065, 10.1815], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance);
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

    mapInstance.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItemsLayer.addLayer(layer);
    });

    return () => {
      mapInstance.remove();
    };
  }, [map]);

  const handleConfirmDrawing = () => {
    const geojson = drawnItems.toGeoJSON();
    console.log(geojson);
    alert('Drawing confirmed! Check the console for the GeoJSON data.');
  };

  const handleShapefileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Shapefile "${file.name}" submitted.`);
      // Here you would typically process the shapefile
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-8">Landowner - Define Your Land</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Confirm Geometry or Upload Shapefile</h2>
          <div className="space-y-4">
            <button onClick={handleConfirmDrawing} className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              Confirm Drawing
            </button>
            <div>
              <label htmlFor="shapefile" className="block text-sm font-medium text-gray-700">Or upload a Shapefile (.shp)</label>
              <input id="shapefile" type="file" onChange={handleShapefileUpload} accept=".shp,.shx,.dbf" multiple className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Interactive Map</h2>
          <div id="map-landowner" style={{ height: '60vh' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LandownerPage;