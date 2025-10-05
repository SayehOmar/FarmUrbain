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

interface SelectedLandDisplayProps {
  selectedLand: GeometryData | null;
}

const SelectedLandDisplay: React.FC<SelectedLandDisplayProps> = ({
  selectedLand,
}) => {
  if (!selectedLand) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
        <p>Click on a marker on the map to see land details</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-3">{selectedLand.properties.name}</h3>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <span className="font-semibold">Surface:</span>{" "}
          {selectedLand.properties.surface ? `${selectedLand.properties.surface.toFixed(2)} sqm` : 'N/A'}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Price:</span>{" "}
          {selectedLand.properties.price}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Land Type:</span>{" "}
          {selectedLand.properties.landType}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Description:</span>{" "}
          {selectedLand.properties.description}
        </p>
      </div>
      <button className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold">
        Confirm Rental
      </button>
    </div>
  );
};

export default SelectedLandDisplay;
