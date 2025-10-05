import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PolygonCoordinates extends Array<[number, number]> {
  0: [number, number][]; // first ring
}

interface MultiPolygonCoordinates extends Array<PolygonCoordinates> {
  0: PolygonCoordinates; // first polygon
}

interface GeometryData {
  _id: string;
  type: "Polygon" | "MultiPolygon";
  coordinates: PolygonCoordinates | MultiPolygonCoordinates;
  properties: {
    name: string;
    size: string;
    price: string;
    [key: string]: any;
  };
}

interface MapContainerProps {
  geometries: GeometryData[];
  setSelectedLand: (land: GeometryData | null) => void;
  setShowPanel: (show: boolean) => void;
  setMap: (map: any) => void;
  map: any;
}

const MapContainer: React.FC<MapContainerProps> = ({
  geometries,
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
      // Clear existing layers before adding new ones
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon) {
          map.removeLayer(layer);
        }
      });

      geometries.forEach((geometry) => {
        if (!geometry.coordinates || geometry.coordinates.length === 0) {
          console.warn(
            "Geometry has no coordinates, skipping layer:",
            geometry
          );
          return;
        }

        let layer;
        switch (geometry.type) {
          case "Polygon":
            const polygonCoords = geometry.coordinates as PolygonCoordinates;
            const latLngsPolygon = polygonCoords[0].map((coord) => [
              coord[1],
              coord[0],
            ]);
            layer = L.polygon(latLngsPolygon);
            break;
          case "MultiPolygon":
            const multiPolygonCoords =
              geometry.coordinates as MultiPolygonCoordinates;
            const latLngsMultiPolygon = multiPolygonCoords.map((polygon) =>
              polygon[0].map((coord) => [coord[1], coord[0]])
            );
            layer = L.polygon(latLngsMultiPolygon);
            break;
          default:
            console.warn(
              "Unsupported geometry type, skipping layer:",
              geometry.type
            );
            return;
        }

        if (layer) {
          layer.addTo(map);
          layer.on("click", () => {
            setSelectedLand(geometry);
            setShowPanel(true);
          });
        }
      });
    });
  }, [map, geometries, isClient, setSelectedLand, setShowPanel]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading map...</div>
      </div>
    );
  }

  return (
    <div id="map-urban-farm" className="absolute inset-0 w-full h-full"></div>
  );
};

export default MapContainer;
