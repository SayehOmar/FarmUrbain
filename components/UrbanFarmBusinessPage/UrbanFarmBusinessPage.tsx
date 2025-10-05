import React, { useState, useEffect } from "react";
import UrbanFarmBusinessHeader from "./UrbanFarmBusinessHeader";
import MapContainer from "./MapContainer";
import LandDetailsPanel from "./LandDetailsPanel";

interface UrbanFarmBusinessPageProps {
  goBack: () => void;
}

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

const UrbanFarmBusinessPage: React.FC<UrbanFarmBusinessPageProps> = ({
  goBack,
}) => {
  const [map, setMap] = useState<any>(null);
  const [geometries, setGeometries] = useState<GeometryData[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<GeometryData[]>([]);
  const [selectedLand, setSelectedLand] = useState<GeometryData | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchGeometries = async () => {
      try {
        const response = await fetch("/api/geometries");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GeometryData[] = await response.json();
        setGeometries(data);
        setFilteredGeometries(data); // Initialize filtered geometries with all geometries
      } catch (error) {
        console.error("Error fetching geometries:", error);
      }
    };

    fetchGeometries();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = geometries.filter((geometry) =>
      geometry.properties.name.toLowerCase().includes(searchTerm)
    );
    setFilteredGeometries(filtered);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MapContainer
        geometries={filteredGeometries}
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
        filteredLands={filteredGeometries} // Pass filteredGeometries here
        handleSearch={handleSearch}
        map={map}
      />
    </div>
  );
};

export default UrbanFarmBusinessPage;