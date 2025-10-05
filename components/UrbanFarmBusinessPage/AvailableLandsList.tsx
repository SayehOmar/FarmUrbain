import React from 'react';

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
    surface: number; // Changed from size to surface
    price: string;
    landType: string;
    description: string;
    [key: string]: any;
  };
}

interface AvailableLandsListProps {
  filteredLands: GeometryData[];
  setSelectedLand: (land: GeometryData | null) => void;
  map: any;
}

const AvailableLandsList: React.FC<AvailableLandsListProps> = ({
  filteredLands,
  setSelectedLand,
  map,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">All Available Lands</h3>
      <div className="space-y-2">
        {filteredLands.map((land) => (
          <div
            key={land._id}
            onClick={() => {
              setSelectedLand(land);
              if (map && land.coordinates && land.coordinates.length > 0) {
                let lat: number, lng: number;
                const polygonCoords = land.coordinates as PolygonCoordinates | MultiPolygonCoordinates;
                // For polygons, take the first coordinate of the first ring/polygon
                if (polygonCoords.length > 0 && polygonCoords[0].length > 0) {
                  [lng, lat] = polygonCoords[0][0];
                } else {
                  console.warn("Polygon/MultiPolygon has no valid coordinates for setView:", land);
                  return;
                }
                map.setView([lat, lng], 15);
              }
            }}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <p className="font-semibold">{land.properties.name}</p>
            <p className="text-sm text-gray-600">
              {land.properties.surface ? `${land.properties.surface.toFixed(2)} sqm` : 'N/A'} • {land.properties.price} • {land.properties.landType}
            </p>
            {land.properties.description && (
              <p className="text-xs text-gray-500">{land.properties.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableLandsList;
