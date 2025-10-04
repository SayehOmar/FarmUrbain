import React, { useState } from "react";
import UrbanFarmBusinessHeader from "./UrbanFarmBusinessHeader";
import MapContainer from "./MapContainer";
import LandDetailsPanel from "./LandDetailsPanel";

interface UrbanFarmBusinessPageProps {
  goBack: () => void;
}

const UrbanFarmBusinessPage: React.FC<UrbanFarmBusinessPageProps> = ({
  goBack,
}) => {
  const availableLands = [
    {
      id: 1,
      name: "City Center Rooftop",
      coords: [36.8065, 10.1815],
      size: "200 sqm",
      price: "$500/month",
    },
    {
      id: 2,
      name: "Suburb Lot",
      coords: [36.8625, 10.1956],
      size: "500 sqm",
      price: "$800/month",
    },
    {
      id: 3,
      name: "Industrial Park Plot",
      coords: [36.7721, 10.151],
      size: "1000 sqm",
      price: "$1200/month",
    },
  ];

  const [map, setMap] = useState<any>(null);
  const [filteredLands, setFilteredLands] = useState(availableLands);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = availableLands.filter((land) =>
      land.name.toLowerCase().includes(searchTerm)
    );
    setFilteredLands(filtered);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MapContainer
        filteredLands={filteredLands}
        setSelectedLand={setSelectedLand}
        setShowPanel={setShowPanel}
        setMap={setMap}
        map={map}
      />

      <UrbanFarmBusinessHeader goBack={goBack} />

      {/* Toggle Panel Button - Right Side */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-[1000] p-3 bg-green-700 text-white rounded-lg shadow-lg opacity-30 hover:opacity-100 transition-opacity duration-300"
      >
        {showPanel ? "→" : "←"}
      </button>

      <LandDetailsPanel
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        selectedLand={selectedLand}
        setSelectedLand={setSelectedLand}
        filteredLands={filteredLands}
        handleSearch={handleSearch}
        map={map}
      />
    </div>
  );
};

export default UrbanFarmBusinessPage;