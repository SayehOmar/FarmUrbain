
import React from 'react';

interface MapProps {
  selectedInfo: string;
  selectedScore: string;
  onDownloadReport: () => void;
}

const Map: React.FC<MapProps> = ({ selectedInfo, selectedScore, onDownloadReport }) => {
  return (
    <section className="md:col-span-3 bg-white rounded-lg shadow p-0">
      <div id="map" style={{ height: '70vh' }}></div>
      <div className="p-4 border-t flex items-center justify-between">
        <div>
          <strong id="selectedInfo">{selectedInfo}</strong>
          <div id="selectedScore" className="text-sm text-gray-600">{selectedScore}</div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={onDownloadReport} className="px-3 py-2 bg-green-700 text-white rounded">Export Report</button>
        </div>
      </div>
    </section>
  );
};

export default Map;
