import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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

interface CurrentMetadata {
  name: string;
  size: string;
  landType: string;
  price: string;
  description: string;
}

interface SavedLandParcelsSectionProps {
  drawings: DrawingMetadata[];
  editingDrawing: DrawingMetadata | null;
  setEditingDrawing: React.Dispatch<
    React.SetStateAction<DrawingMetadata | null>
  >;
  expandedDrawing: string | null;
  setExpandedDrawing: React.Dispatch<React.SetStateAction<string | null>>;
  currentMetadata: CurrentMetadata;
  setCurrentMetadata: React.Dispatch<React.SetStateAction<CurrentMetadata>>;
  handleUpdateDrawing: () => void;
  handleCancelEdit: () => void;
  handleEditDrawing: (drawing: DrawingMetadata) => void;
  handleExportDrawing: (drawing: DrawingMetadata) => void;
  handleDeleteDrawing: (id: string) => void;
  handleExportAll: () => void;
}

const SavedLandParcelsSection: React.FC<SavedLandParcelsSectionProps> = ({
  drawings,
  editingDrawing,
  setEditingDrawing,
  expandedDrawing,
  setExpandedDrawing,
  currentMetadata,
  setCurrentMetadata,
  handleUpdateDrawing,
  handleCancelEdit,
  handleEditDrawing,
  handleExportDrawing,
  handleDeleteDrawing,
  handleExportAll,
}) => {
  if (drawings.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-green-700">
          ✓ Saved Land Parcels ({drawings.length})
        </h3>
        <Button
          onClick={handleExportAll}
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export All
        </Button>
      </div>

      <div className="space-y-2">
        {drawings.map((drawing) => (
          <div
            key={drawing.id}
            className="border border-gray-300 rounded-lg overflow-hidden"
          >
            {/* Collapse Header */}
            <Button
              variant="ghost"
              onClick={() =>
                setExpandedDrawing(
                  expandedDrawing === drawing.id ? null : drawing.id
                )
              }
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center transition-colors"
            >
              <div>
                <p className="font-semibold">{drawing.name}</p>
                <p className="text-sm text-gray-600">
                  {drawing.size} • {drawing.price}
                </p>
              </div>
              <span className="text-gray-500">
                {expandedDrawing === drawing.id ? "▼" : "▶"}
              </span>
            </Button>

            {/* Collapse Content */}
            {expandedDrawing === drawing.id && (
              <div className="p-3 bg-white border-t">
                {editingDrawing?.id === drawing.id ? (
                  // Edit Mode
                  <div className="space-y-3 mb-3">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={currentMetadata.name}
                        onChange={(e) =>
                          setCurrentMetadata({
                            ...currentMetadata,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Size
                        </Label>
                        <Input
                          type="text"
                          value={currentMetadata.size}
                          onChange={(e) =>
                            setCurrentMetadata({
                              ...currentMetadata,
                              size: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </Label>
                        <Input
                          type="text"
                          value={currentMetadata.price}
                          onChange={(e) =>
                            setCurrentMetadata({
                              ...currentMetadata,
                              price: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Type
                      </Label>
                      <Select
                        value={currentMetadata.landType}
                        onValueChange={(value) =>
                          setCurrentMetadata({
                            ...currentMetadata,
                            landType: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                          <SelectValue placeholder="Select land type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rooftop">Rooftop</SelectItem>
                          <SelectItem value="vacant">Vacant Lot</SelectItem>
                          <SelectItem value="industrial">
                            Industrial Plot
                          </SelectItem>
                          <SelectItem value="residential">
                            Residential Yard
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </Label>
                      <Textarea
                        value={currentMetadata.description}
                        onChange={(e) =>
                          setCurrentMetadata({
                            ...currentMetadata,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateDrawing}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="space-y-2 text-sm mb-3">
                      <p>
                        <span className="font-semibold">Type:</span>{" "}
                        {drawing.landType}
                      </p>
                      <p>
                        <span className="font-semibold">Description:</span>{" "}
                        {drawing.description || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditDrawing(drawing)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => handleExportDrawing(drawing)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Export
                      </Button>
                      <Button
                        onClick={() => handleDeleteDrawing(drawing.id)}
                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLandParcelsSection;
