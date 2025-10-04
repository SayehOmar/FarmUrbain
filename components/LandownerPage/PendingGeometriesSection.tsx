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

interface PendingGeometriesSectionProps {
  pendingGeometries: PendingGeometry[];
  currentMetadata: CurrentMetadata;
  setCurrentMetadata: React.Dispatch<React.SetStateAction<CurrentMetadata>>;
  handleSaveGeometry: (geometryId: string) => void;
  handleDeletePendingGeometry: (geometryId: string) => void;
}

const PendingGeometriesSection: React.FC<PendingGeometriesSectionProps> = ({
  pendingGeometries,
  currentMetadata,
  setCurrentMetadata,
  handleSaveGeometry,
  handleDeletePendingGeometry,
}) => {
  if (pendingGeometries.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-3 text-orange-700">
        ⚠️ Pending Land Parcels ({pendingGeometries.length})
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Please add metadata for each drawn geometry:
      </p>

      <div className="space-y-4">
        {pendingGeometries.map((geometry, index) => (
          <div
            key={geometry.id}
            className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Geometry #{index + 1}</h4>
              <Button
                variant="ghost"
                onClick={() => handleDeletePendingGeometry(geometry.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </Button>
            </div>

            <div className="space-y-3">
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
                  placeholder="e.g., City Center Rooftop"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Size <span className="text-red-500">*</span>
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
                    placeholder="200 sqm"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
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
                    placeholder="$500/mo"
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
                    setCurrentMetadata({ ...currentMetadata, landType: value })
                  }
                >
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                    <SelectValue placeholder="Select land type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rooftop">Rooftop</SelectItem>
                    <SelectItem value="vacant">Vacant Lot</SelectItem>
                    <SelectItem value="industrial">Industrial Plot</SelectItem>
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
                  placeholder="Additional details..."
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <Button
              onClick={() => handleSaveGeometry(geometry.id)}
              className="w-full mt-3 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold"
            >
              💾 Save This Parcel
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingGeometriesSection;
