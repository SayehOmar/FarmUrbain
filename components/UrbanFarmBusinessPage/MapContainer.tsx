import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  filteredLands: any[];
  setSelectedLand: (land: any) => void;
  setShowPanel: (show: boolean) => void;
  setMap: (map: any) => void;
  map: any;
}

const MapContainer: React.FC<MapContainerProps> = ({
  filteredLands,
  setSelectedLand,
  setShowPanel,
  setMap,
  map,
}) => {
  const [isClient, setIsClient] = useState(false);

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
  }, [isClient, map, setMap]);

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
  }, [map, filteredLands, isClient, setSelectedLand, setShowPanel]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading map...</div>
      </div>
    );
  }

  return <div id="map-urban-farm" className="absolute inset-0 w-full h-full"></div>;
};

export default MapContainer;
