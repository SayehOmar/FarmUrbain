import React from 'react';
import PendingGeometriesSection from './PendingGeometriesSection';
import SavedLandParcelsSection from './SavedLandParcelsSection';
import DrawingInstructions from './DrawingInstructions';
import ShapefileUploadSection from './ShapefileUploadSection';

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

interface CurrentMetadata {
  name: string;
  size: string;
  landType: string;
  price: string;
  description: string;
}

interface LandownerPanelProps {
  showPanel: boolean;
  setShowPanel: (show: boolean) => void;
  pendingGeometries: PendingGeometry[];
  setPendingGeometries: React.Dispatch<React.SetStateAction<PendingGeometry[]>>;
  drawings: DrawingMetadata[];
  setDrawings: React.Dispatch<React.SetStateAction<DrawingMetadata[]>>;
  editingDrawing: DrawingMetadata | null;
  setEditingDrawing: React.Dispatch<React.SetStateAction<DrawingMetadata | null>>;
  expandedDrawing: string | null;
  setExpandedDrawing: React.Dispatch<React.SetStateAction<string | null>>;
  currentMetadata: CurrentMetadata;
  setCurrentMetadata: React.Dispatch<React.SetStateAction<CurrentMetadata>>;
  drawnItems: any;
  map: any; // For setView in SavedLandParcelsSection
  handleSaveGeometry: (geometryId: string) => void;
  handleEditDrawing: (drawing: DrawingMetadata) => void;
  handleUpdateDrawing: () => void;
  handleCancelEdit: () => void;
  handleDeletePendingGeometry: (geometryId: string) => void;
  handleExportDrawing: (drawing: DrawingMetadata) => void;
  handleExportAll: () => void;
  handleDeleteDrawing: (id: string) => void;
  handleShapefileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LandownerPanel: React.FC<LandownerPanelProps> = ({
  showPanel,
  setShowPanel,
  pendingGeometries,
  setPendingGeometries,
  drawings,
  setDrawings,
  editingDrawing,
  setEditingDrawing,
  expandedDrawing,
  setExpandedDrawing,
  currentMetadata,
  setCurrentMetadata,
  drawnItems,
  map,
  handleSaveGeometry,
  handleEditDrawing,
  handleUpdateDrawing,
  handleCancelEdit,
  handleDeletePendingGeometry,
  handleExportDrawing,
  handleExportAll,
  handleDeleteDrawing,
  handleShapefileUpload,
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

        <h2 className="text-2xl font-bold mb-6 mt-8">Submit Your Land</h2>

        <PendingGeometriesSection
          pendingGeometries={pendingGeometries}
          currentMetadata={currentMetadata}
          setCurrentMetadata={setCurrentMetadata}
          handleSaveGeometry={handleSaveGeometry}
          handleDeletePendingGeometry={handleDeletePendingGeometry}
        />

        <SavedLandParcelsSection
          drawings={drawings}
          editingDrawing={editingDrawing}
          setEditingDrawing={setEditingDrawing}
          expandedDrawing={expandedDrawing}
          setExpandedDrawing={setExpandedDrawing}
          currentMetadata={currentMetadata}
          setCurrentMetadata={setCurrentMetadata}
          handleUpdateDrawing={handleUpdateDrawing}
          handleCancelEdit={handleCancelEdit}
          handleEditDrawing={handleEditDrawing}
          handleExportDrawing={handleExportDrawing}
          handleDeleteDrawing={handleDeleteDrawing}
          handleExportAll={handleExportAll}
        />
          
        <div className="space-y-6">
          <DrawingInstructions />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <ShapefileUploadSection handleShapefileUpload={handleShapefileUpload} />
        </div>
      </div>
    </div>
  );
};

export default LandownerPanel;
