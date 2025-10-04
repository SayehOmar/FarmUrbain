import React from 'react';

interface SelectedLandDisplayProps {
  selectedLand: any;
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
  );
};

export default SelectedLandDisplay;
