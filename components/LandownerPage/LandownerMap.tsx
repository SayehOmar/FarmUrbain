import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface LandownerMapProps {
  setMap: (map: any) => void;
  setDrawnItems: (drawnItems: any) => void;
  setPendingGeometries: React.Dispatch<React.SetStateAction<any[]>>;
  setShowPanel: (show: boolean) => void;
  map: any;
}

const LandownerMap: React.FC<LandownerMapProps> = ({
  setMap,
  setDrawnItems,
  setPendingGeometries,
  setShowPanel,
  map,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || map) return;

    Promise.all([
      import('leaflet'),
      import('leaflet-draw')
    ]).then(([L]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

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

      mapInstance.on('draw:created', (event: any) => {
        const layer = event.layer;
        drawnItemsLayer.addLayer(layer);
        
        const newGeometry = {
          id: `pending-${Date.now()}-${Math.random()}`,
          layer: layer,
          geojson: layer.toGeoJSON()
        };
        
        setPendingGeometries(prev => [...prev, newGeometry]);
        setShowPanel(true);
      });
    }).catch((error) => {
      console.error('Error loading Leaflet or Leaflet Draw:', error);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isClient, map, setMap, setDrawnItems, setPendingGeometries, setShowPanel]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading map...</div>
      </div>
    );
  }

  return (
    <div
      id="map-landowner"
      className="absolute inset-0 w-full h-full"
    ></div>
  );
};

export default LandownerMap;
