import React from 'react';
import LandSearchInput from './LandSearchInput';
import SelectedLandDisplay from './SelectedLandDisplay';
import AvailableLandsList from './AvailableLandsList';

interface LandDetailsPanelProps {
  showPanel: boolean;
  setShowPanel: (show: boolean) => void;
  selectedLand: any;
  setSelectedLand: (land: any) => void;
  filteredLands: any[];
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  map: any;
}

const LandDetailsPanel: React.FC<LandDetailsPanelProps> = ({
  showPanel,
  setShowPanel,
  selectedLand,
  setSelectedLand,
  filteredLands,
  handleSearch,
  map,
}) => {
  return (
    <div
      className={`absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out ${
        showPanel ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto p-6">
        {/* Close Button Inside Panel */}
        <button
          onClick={() => setShowPanel(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 mt-8">Available Lands</h2>

        <LandSearchInput handleSearch={handleSearch} />

        <SelectedLandDisplay selectedLand={selectedLand} />

        <AvailableLandsList
          filteredLands={filteredLands}
          setSelectedLand={setSelectedLand}
          map={map}
        />
      </div>
    </div>
  );
};

export default LandDetailsPanel;
