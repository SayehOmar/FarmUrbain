"use client";
import React, { useEffect, useState } from 'react';
import LandownerMap from './LandownerMap';
import LandownerPanel from './LandownerPanel';

interface LandownerPageProps {
  goBack: () => void;
}

interface DrawingMetadata {
  id: string;
  name: string;
  size: string;
  landType: string;
  price: string;
  description: string;
  geojson: any;
  layer?: any;
}

interface PendingGeometry {
  id: string;
  layer: any;
  geojson: any;
}

const LandownerPage: React.FC<LandownerPageProps> = ({ goBack }) => {
  const [map, setMap] = useState<any>(null);
  const [drawnItems, setDrawnItems] = useState<any>(null);
  const [pendingGeometries, setPendingGeometries] = useState<PendingGeometry[]>(
    []
  );
  const [drawings, setDrawings] = useState<DrawingMetadata[]>([]);
  const [editingDrawing, setEditingDrawing] = useState<DrawingMetadata | null>(
    null
  );
  const [expandedDrawing, setExpandedDrawing] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState({
    name: "",
    size: "",
    landType: "rooftop",
    price: "",
    description: "",
  });

  // Handlers
  const handleSaveGeometry = async (geometryId: string) => {
    if (!currentMetadata.name || !currentMetadata.size || !currentMetadata.price) {
      alert('Please fill in all required fields (Name, Size, Price)');
      return;
    }

    const geometry = pendingGeometries.find(g => g.id === geometryId);
    if (!geometry) return;

    const newDrawing: DrawingMetadata = {
      id: `drawing-${Date.now()}-${Math.random()}`,
      ...currentMetadata,
      geojson: geometry.geojson,
      layer: geometry.layer
    };

    try {
      const response = await fetch('/api/geometries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newDrawing.geojson.geometry.type,
          coordinates: newDrawing.geojson.geometry.coordinates,
          properties: {
            name: newDrawing.name,
            size: newDrawing.size,
            landType: newDrawing.landType,
            price: newDrawing.price,
            description: newDrawing.description,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save geometry');
      }

      const result = await response.json();
      console.log('Geometry saved to DB:', result.geometry);

      setDrawings([...drawings, newDrawing]);
      
      // Remove from pending
      setPendingGeometries(prev => prev.filter(g => g.id !== geometryId));
      
      // Reset form
      setCurrentMetadata({
        name: '',
        size: '',
        landType: 'rooftop',
        price: '',
        description: ''
      });
      
      alert('Land parcel saved successfully!');
    } catch (error) {
      console.error('Failed to save land parcel:', error);
      alert(`Failed to save land parcel: ${(error as Error).message}. Please try again.`);
    }
  };

  const handleEditDrawing = (drawing: DrawingMetadata) => {
    setEditingDrawing(drawing);
    setCurrentMetadata({
      name: drawing.name,
      size: drawing.size,
      landType: drawing.landType,
      price: drawing.price,
      description: drawing.description,
    });
    setExpandedDrawing(drawing.id);
  };

  const handleUpdateDrawing = () => {
    if (!editingDrawing) return;

    if (
      !currentMetadata.name ||
      !currentMetadata.size ||
      !currentMetadata.price
    ) {
      alert("Please fill in all required fields (Name, Size, Price)");
      return;
    }

    const updatedDrawings = drawings.map((d) =>
      d.id === editingDrawing.id ? { ...d, ...currentMetadata } : d
    );

    setDrawings(updatedDrawings);
    setEditingDrawing(null);
    setCurrentMetadata({
      name: "",
      size: "",
      landType: "rooftop",
      price: "",
      description: "",
    });

    alert("Land parcel updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingDrawing(null);
    setCurrentMetadata({
      name: "",
      size: "",
      landType: "rooftop",
      price: "",
      description: "",
    });
  };

  const handleDeletePendingGeometry = (geometryId: string) => {
    const geometry = pendingGeometries.find((g) => g.id === geometryId);
    if (geometry && drawnItems) {
      drawnItems.removeLayer(geometry.layer);
    }
    setPendingGeometries((prev) => prev.filter((g) => g.id !== geometryId));
  };

  const handleExportDrawing = (drawing: DrawingMetadata) => {
    const exportData = {
      type: "Feature",
      geometry: drawing.geojson.geometry,
      properties: {
        name: drawing.name,
        size: drawing.size,
        landType: drawing.landType,
        price: drawing.price,
        description: drawing.description,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${drawing.name.replace(/\s+/g, "_")}_land.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    if (drawings.length === 0) {
      alert("No drawings to export");
      return;
    }

    const allData = {
      type: "FeatureCollection",
      features: drawings.map((d) => ({
        type: "Feature",
        geometry: d.geojson.geometry,
        properties: {
          name: d.name,
          size: d.size,
          landType: d.landType,
          price: d.price,
          description: d.description,
        },
      })),
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `all_land_parcels_${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteDrawing = (id: string) => {
    if (confirm("Are you sure you want to delete this land parcel?")) {
      const drawing = drawings.find((d) => d.id === id);
      if (drawing && drawing.layer && drawnItems) {
        drawnItems.removeLayer(drawing.layer);
      }
      setDrawings(drawings.filter((d) => d.id !== id));
    }
  };

  const handleShapefileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Shapefile "${file.name}" submitted.`);
      // Here you would typically process the shapefile
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <LandownerMap
        setMap={setMap}
        setDrawnItems={setDrawnItems}
        setPendingGeometries={setPendingGeometries}
        setShowPanel={setShowPanel}
        map={map}
      />

      {/* Go Back Button - Top Left */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 z-[1000] px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      >
        ← Go Back
      </button>

      {/* Toggle Panel Button - Right Side */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-[1000] p-3 bg-green-700 text-white rounded-lg shadow-lg opacity-30 hover:opacity-100 transition-opacity duration-300"
      >
        {showPanel ? "→" : "←"}
      </button>

      <LandownerPanel
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        pendingGeometries={pendingGeometries}
        setPendingGeometries={setPendingGeometries}
        drawings={drawings}
        setDrawings={setDrawings}
        editingDrawing={editingDrawing}
        setEditingDrawing={setEditingDrawing}
        expandedDrawing={expandedDrawing}
        setExpandedDrawing={setExpandedDrawing}
        currentMetadata={currentMetadata}
        setCurrentMetadata={setCurrentMetadata}
        drawnItems={drawnItems}
        map={map}
        handleSaveGeometry={handleSaveGeometry}
        handleEditDrawing={handleEditDrawing}
        handleUpdateDrawing={handleUpdateDrawing}
        handleCancelEdit={handleCancelEdit}
        handleDeletePendingGeometry={handleDeletePendingGeometry}
        handleExportDrawing={handleExportDrawing}
        handleExportAll={handleExportAll}
        handleDeleteDrawing={handleDeleteDrawing}
        handleShapefileUpload={handleShapefileUpload}
      />
    </div>
  );
};

export default LandownerPage;
