import React from 'react';

interface AvailableLandsListProps {
  filteredLands: any[];
  setSelectedLand: (land: any) => void;
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
  );
};

export default AvailableLandsList;
