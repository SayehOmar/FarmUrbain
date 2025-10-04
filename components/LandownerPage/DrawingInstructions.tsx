import React from 'react';

const DrawingInstructions: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-blue-900 mb-2">📍 How to Mark Your Land</h3>
      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
        <li>Use the drawing tools on the left side of the map</li>
        <li>Draw a polygon or rectangle for each land parcel</li>
        <li>Fill in the metadata form that appears</li>
        <li>Save each parcel individually</li>
      </ol>
    </div>
  );
};

export default DrawingInstructions;
